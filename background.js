const STORAGE_KEY = "mockMasterState";
const DEFAULT_STATE = { globalEnabled: false };

async function getState() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || DEFAULT_STATE;
}

async function setState(state) {
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

/* ----Icon management---- */
function drawIcon(size, active) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const s = size;
  const r = s * 0.22;

  // Rounded rectangle background
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(s - r, 0);
  ctx.arcTo(s, 0, s, r, r);
  ctx.lineTo(s, s - r);
  ctx.arcTo(s, s, s - r, s, r);
  ctx.lineTo(r, s);
  ctx.arcTo(0, s, 0, s - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fillStyle = active ? "#f59e0b" : "#4b5563";
  ctx.fill();

  // ">" chevron symbol
  ctx.beginPath();
  ctx.moveTo(s * 0.3, s * 0.27);
  ctx.lineTo(s * 0.68, s * 0.5);
  ctx.lineTo(s * 0.3, s * 0.73);
  ctx.strokeStyle = active ? "#1c1917" : "#9ca3af";
  ctx.lineWidth = s * 0.115;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  return ctx.getImageData(0, 0, s, s);
}

async function updateIcon(enabled) {
  try {
    await chrome.action.setIcon({
      imageData: {
        16: drawIcon(16, enabled),
        32: drawIcon(32, enabled),
        48: drawIcon(48, enabled),
        128: drawIcon(128, enabled),
      },
    });
    await chrome.action.setTitle({
      title: `API Mock Master — ${enabled ? "Active" : "Disabled"}`,
    });
    await chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
    if (!enabled)
      await chrome.action.setBadgeBackgroundColor({ color: "#4b5563" });
  } catch (e) {
    console.warn("updateIcon failed:", e);
  }
}

// Set icon on startup / install
async function initIcon() {
  const state = await getState();
  await updateIcon(state.globalEnabled);
}
chrome.runtime.onInstalled.addListener(initIcon);
chrome.runtime.onStartup.addListener(initIcon);

// ---Message handler---
chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  switch (msg.type) {
    case "GET_STATE":
      getState().then(respond);
      return true;

    case "SET_GLOBAL":
      getState().then(async (state) => {
        state.globalEnabled = msg.enabled;
        await setState(state);
        await updateIcon(msg.enabled);
        respond({ ok: true });
      });
      return true;
  }
});

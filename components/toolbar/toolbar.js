"use strict";

import { q } from "../../utils.js";
import { state, sendMsg } from "../../state.js";

export function bindToolbar() {
  const gt = q("#global-toggle");
  gt.checked = state.globalEnabled;
  gt.addEventListener("change", async () => {
    state.globalEnabled = gt.checked;
    await sendMsg({ type: "SET_GLOBAL", enabled: state.globalEnabled });
  });

  const closeBtn = q("#btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => window.close());
  }
}

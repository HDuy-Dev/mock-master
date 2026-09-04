"use strict";

export const state = { globalEnabled: false };

export function setState(newState) {
  Object.assign(state, newState);
}

export function sendMsg(msg) {
  return chrome.runtime.sendMessage(msg);
}

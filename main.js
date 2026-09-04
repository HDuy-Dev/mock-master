"use strict";

import { setState, sendMsg } from "./state.js";
import { bindToolbar } from "./components/toolbar/toolbar.js";

async function init() {
  const stateResult = await sendMsg({ type: "GET_STATE" });
  setState(stateResult);
  bindToolbar();
}

init();

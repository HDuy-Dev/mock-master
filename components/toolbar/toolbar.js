"use strict";

import { q } from "../../utils.js";

export function bindToolbar() {
  const closeBtn = q("#btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => window.close());
  }
}

"use strict";

export function q(selector, ctx) {
  return (ctx || document).querySelector(selector);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEl = createEl;
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    if (text)
        el.textContent = text;
    return el;
}

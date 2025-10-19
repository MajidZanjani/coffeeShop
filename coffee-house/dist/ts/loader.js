"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
class Loader {
    constructor(containerSelector, fullPage = true) {
        const container = document.querySelector(containerSelector);
        if (!container)
            throw new Error(`Container "${containerSelector}" not found`);
        this.container = container;
        this.fullPage = fullPage;
        // Ensure container can position child absolutely
        const computedStyle = getComputedStyle(this.container);
        if (computedStyle.position === "static") {
            this.container.style.position = "relative";
        }
        // Create overlay element
        this.overlay = document.createElement("div");
        this.overlay.classList.add("custom-loader-overlay");
        this.overlay.innerHTML = `
      <div class="custom-loader">
        <p>Loading please wait...</p>
        <img src="../img/coffee-cup.png" alt="coffee-cup">
      </div>
    `;
        // Define loader styles
        this.style = document.createElement("style");
        if (this.fullPage) {
            const computedStyle = getComputedStyle(this.container);
            if (computedStyle.position === "static") {
                this.container.style.position = "relative";
            }
            this.style = document.createElement("style");
            this.style.textContent = `
      .custom-loader-overlay {
        position: ${this.fullPage ? "fixed" : "absolute"};
        top: 0;
        left: 0;
        width: ${this.fullPage ? "100vw" : "100%"};
        height: ${this.fullPage ? "100vh" : "100%"};
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
      }

      .custom-loader {
        text-align: center;
      }

      .custom-loader img {
        width: 50px;
        height: 50px;
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0.5; }
      }
    `;
        }
    }
    /** Show loader inside container */
    show() {
        if (!document.head.contains(this.style))
            document.head.appendChild(this.style);
        if (!this.container.contains(this.overlay))
            this.container.appendChild(this.overlay);
    }
    /** Hide loader with fade-out */
    hide() {
        this.overlay.style.opacity = "0";
        this.overlay.style.visibility = "hidden";
        setTimeout(() => {
            if (this.overlay.parentElement)
                this.overlay.remove();
        }, 500);
    }
    /** Helper to show loader for a duration */
    simulate(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.show();
            yield new Promise((resolve) => setTimeout(resolve, duration));
            this.hide();
        });
    }
}
exports.Loader = Loader;

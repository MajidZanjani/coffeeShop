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
exports.carousel = carousel;
const loader_1 = require("./loader");
const carouselTemplate_1 = require("./carouselTemplate");
function carousel() {
    document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
        (0, carouselTemplate_1.renderCarousel)();
        const loader = new loader_1.Loader(".fav-coffee", false);
        // Simulate fetch delay
        yield loader.simulate(3000);
        initCarousel();
    }));
}
function initCarousel() {
    const items = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".indicator");
    const leftArrow = document.querySelector(".carousel-arrow.left");
    const rightArrow = document.querySelector(".carousel-arrow.right");
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-track");
    if (!items.length || !carousel || !track)
        return;
    let current = 0;
    let autoScrollTimer = null;
    let isPaused = false;
    let lastTick = Date.now();
    let remaining = 7000;
    // --- Slide Display ---
    function showSlide(index) {
        if (!items.length)
            return;
        index = (index + items.length) % items.length;
        const prevIndex = (index - 1 + items.length) % items.length;
        items.forEach((item, i) => {
            item.classList.remove("position-active", "position-prev", "position-next", "active");
            if (i === index)
                item.classList.add("position-active", "active");
            else if (i === prevIndex)
                item.classList.add("position-prev");
            else
                item.classList.add("position-next");
            if (indicators[i]) {
                indicators[i].classList.toggle("active", i === index);
                // reset fill animation
                const fill = indicators[i].querySelector(".fill");
                if (fill) {
                    fill.style.transition = "none";
                    fill.style.width = "0%";
                    // force reflow to restart transition
                    void fill.offsetWidth;
                    if (i === index) {
                        fill.style.transition = "width 7s linear";
                        fill.style.width = "100%";
                    }
                }
            }
        });
        current = index;
    }
    // --- Navigation ---
    function nextSlide() {
        showSlide(current + 1);
    }
    function prevSlide() {
        showSlide(current - 1);
    }
    // --- Auto-scroll ---
    function startAutoScroll(timeout = 7000) {
        if (autoScrollTimer)
            clearTimeout(autoScrollTimer);
        lastTick = Date.now();
        autoScrollTimer = setTimeout(() => {
            if (!isPaused) {
                nextSlide();
                startAutoScroll(7000);
            }
        }, timeout);
    }
    function pauseAutoScroll() {
        var _a, _b;
        if (isPaused)
            return;
        isPaused = true;
        if (autoScrollTimer) {
            clearTimeout(autoScrollTimer);
            remaining -= Date.now() - lastTick;
        }
        // Pause fill animation
        const activeFill = (_a = indicators[current]) === null || _a === void 0 ? void 0 : _a.querySelector(".fill");
        if (activeFill) {
            const computedWidth = getComputedStyle(activeFill).width;
            const parentWidth = (_b = activeFill.parentElement) === null || _b === void 0 ? void 0 : _b.offsetWidth;
            if (!parentWidth)
                return;
            const percent = (parseFloat(computedWidth) / parentWidth) * 100;
            activeFill.style.transition = "none";
            activeFill.style.width = percent + "%";
        }
    }
    function resumeAutoScroll() {
        var _a;
        if (!isPaused)
            return;
        isPaused = false;
        startAutoScroll(remaining > 0 ? remaining : 7000);
        // Resume fill animation
        const activeFill = (_a = indicators[current]) === null || _a === void 0 ? void 0 : _a.querySelector(".fill");
        if (activeFill) {
            // resume animation for remaining time
            activeFill.style.transition = `width ${remaining}ms linear`;
            activeFill.style.width = "100%";
        }
        remaining = 7000;
    }
    // --- Arrow controls ---
    leftArrow === null || leftArrow === void 0 ? void 0 : leftArrow.addEventListener("click", () => {
        prevSlide();
        pauseAutoScroll();
    });
    rightArrow === null || rightArrow === void 0 ? void 0 : rightArrow.addEventListener("click", () => {
        nextSlide();
        pauseAutoScroll();
    });
    // --- Indicators ---
    indicators.forEach((indicator, i) => {
        indicator.addEventListener("click", () => {
            showSlide(i);
            pauseAutoScroll();
        });
    });
    // --- Mouse hover / touch ---
    // carousel is non-null here because of the guard above
    [
        "mouseenter",
        "touchstart",
    ].forEach((ev) => carousel.addEventListener(ev, () => pauseAutoScroll()));
    [
        "mouseleave",
        "touchend",
    ].forEach((ev) => carousel.addEventListener(ev, () => resumeAutoScroll()));
    // --- Swipe support ---
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => {
        pauseAutoScroll();
        startX = e.touches[0].clientX;
    });
    carousel.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50)
            (diff > 0 ? nextSlide : prevSlide)();
        resumeAutoScroll();
    });
    // --- Init ---
    showSlide(0);
    startAutoScroll();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layout = layout;
function layout() {
    // Media query script
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    function updateDeviceClass(e) {
        if (e.matches) {
            // Desktop
            document.body.classList.add("desktop");
            document.body.classList.remove("touch-device");
        }
        else {
            // Touch device
            document.body.classList.add("touch-device");
            document.body.classList.remove("desktop");
        }
    }
    updateDeviceClass(mediaQuery);
    // Smooth scrolling script
    // Run again when device capabilities change
    mediaQuery.addEventListener("change", (e) => updateDeviceClass(e));
    // add smooth scroll
    document
        .querySelectorAll('a[href^="#"]')
        .forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            // Use currentTarget to get the anchor element in a type-safe way
            const targetAnchor = e.currentTarget;
            if (!targetAnchor)
                return;
            const href = targetAnchor.getAttribute("href");
            if (!href)
                return;
            // prefer getElementById when href is a hash
            const id = href.startsWith("#") ? href.slice(1) : null;
            const target = id
                ? document.getElementById(id)
                : document.querySelector(href);
            if (!target)
                return;
            const start = window.scrollY || window.pageYOffset;
            const end = target.getBoundingClientRect().top + window.scrollY;
            const duration = 600; // milliseconds
            const startTime = performance.now();
            function scrollAnimation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress; // easeInOut
                window.scrollTo(0, start + (end - start) * ease);
                if (elapsed < duration) {
                    requestAnimationFrame(scrollAnimation);
                }
            }
            requestAnimationFrame(scrollAnimation);
        });
    });
}

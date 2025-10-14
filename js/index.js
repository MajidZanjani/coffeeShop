// Media query script
const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
function updateDeviceClass(e) {
  if (e.matches) {
    // Desktop
    document.body.classList.add("desktop");
    document.body.classList.remove("touch-device");
  } else {
    // Touch device
    document.body.classList.add("touch-device");
    document.body.classList.remove("desktop");
  }
}
updateDeviceClass(mediaQuery);

// Smooth scrolling script
// Run again when device capabilities change
mediaQuery.addEventListener("change", updateDeviceClass);

// add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY;
    const duration = 600; // 600 milli-seconds wait
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
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

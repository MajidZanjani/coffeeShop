import { Loader } from "./loader";
import { renderCarousel } from "./carouselTemplate";

export function carousel(): void {
  document.addEventListener("DOMContentLoaded", async () => {
    renderCarousel();
    const loader = new Loader(".fav-coffee", false);

    // Simulate fetch delay
    await loader.simulate(3000);

    initCarousel();
  });
}

function initCarousel(): void {
  const items: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>(".carousel-item");
  const indicators: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>(".indicator");
  const leftArrow: HTMLElement | null = document.querySelector<HTMLElement>(
    ".carousel-arrow.left"
  );
  const rightArrow: HTMLElement | null = document.querySelector<HTMLElement>(
    ".carousel-arrow.right"
  );
  const carousel: HTMLElement | null =
    document.querySelector<HTMLElement>(".carousel");
  const track: HTMLElement | null =
    document.querySelector<HTMLElement>(".carousel-track");

  if (!items.length || !carousel || !track) return;

  let current: number = 0;
  let autoScrollTimer: ReturnType<typeof setTimeout> | null = null;
  let isPaused: boolean = false;
  let lastTick: number = Date.now();
  let remaining: number = 7000;

  // --- Slide Display ---
  function showSlide(index: number): void {
    if (!items.length) return;

    index = (index + items.length) % items.length;
    const prevIndex = (index - 1 + items.length) % items.length;

    items.forEach((item, i) => {
      item.classList.remove(
        "position-active",
        "position-prev",
        "position-next",
        "active"
      );

      if (i === index) item.classList.add("position-active", "active");
      else if (i === prevIndex) item.classList.add("position-prev");
      else item.classList.add("position-next");

      if (indicators[i]) {
        indicators[i].classList.toggle("active", i === index);
        // reset fill animation
        const fill: HTMLElement | null = indicators[i].querySelector(".fill");
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
  function nextSlide(): void {
    showSlide(current + 1);
  }
  function prevSlide(): void {
    showSlide(current - 1);
  }

  // --- Auto-scroll ---
  function startAutoScroll(timeout: number = 7000): void {
    if (autoScrollTimer) clearTimeout(autoScrollTimer);
    lastTick = Date.now();
    autoScrollTimer = setTimeout(() => {
      if (!isPaused) {
        nextSlide();
        startAutoScroll(7000);
      }
    }, timeout);
  }

  function pauseAutoScroll(): void {
    if (isPaused) return;
    isPaused = true;
    if (autoScrollTimer) {
      clearTimeout(autoScrollTimer);
      remaining -= Date.now() - lastTick;
    }
    // Pause fill animation
    const activeFill: HTMLElement | null =
      indicators[current]?.querySelector(".fill");
    if (activeFill) {
      const computedWidth: string = getComputedStyle(activeFill).width;
      const parentWidth: number | undefined =
        activeFill.parentElement?.offsetWidth;
      if (!parentWidth) return;
      const percent: number | undefined =
        (parseFloat(computedWidth) / parentWidth) * 100;
      activeFill.style.transition = "none";
      activeFill.style.width = percent + "%";
    }
  }

  function resumeAutoScroll(): void {
    if (!isPaused) return;
    isPaused = false;
    startAutoScroll(remaining > 0 ? remaining : 7000);

    // Resume fill animation
    const activeFill: HTMLElement | null =
      indicators[current]?.querySelector(".fill");
    if (activeFill) {
      // resume animation for remaining time
      activeFill.style.transition = `width ${remaining}ms linear`;
      activeFill.style.width = "100%";
    }

    remaining = 7000;
  }

  // --- Arrow controls ---
  leftArrow?.addEventListener("click", () => {
    prevSlide();
    pauseAutoScroll();
  });

  rightArrow?.addEventListener("click", () => {
    nextSlide();
    pauseAutoScroll();
  });

  // --- Indicators ---
  indicators.forEach((indicator: HTMLElement, i: number) => {
    indicator.addEventListener("click", () => {
      showSlide(i);
      pauseAutoScroll();
    });
  });

  // --- Mouse hover / touch ---
  // carousel is non-null here because of the guard above
  (
    [
      "mouseenter" as keyof HTMLElementEventMap,
      "touchstart" as keyof HTMLElementEventMap,
    ] as Array<keyof HTMLElementEventMap>
  ).forEach((ev: keyof HTMLElementEventMap) =>
    carousel.addEventListener(
      ev,
      () => pauseAutoScroll() as unknown as EventListener
    )
  );
  (
    [
      "mouseleave" as keyof HTMLElementEventMap,
      "touchend" as keyof HTMLElementEventMap,
    ] as Array<keyof HTMLElementEventMap>
  ).forEach((ev: keyof HTMLElementEventMap) =>
    carousel.addEventListener(
      ev,
      () => resumeAutoScroll() as unknown as EventListener
    )
  );

  // --- Swipe support ---
  let startX: number = 0;
  carousel.addEventListener("touchstart", (e: TouchEvent) => {
    pauseAutoScroll();
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", (e: TouchEvent) => {
    const endX: number = e.changedTouches[0].clientX;
    const diff: number = startX - endX;
    if (Math.abs(diff) > 50) (diff > 0 ? nextSlide : prevSlide)();
    resumeAutoScroll();
  });

  // --- Init ---
  showSlide(0);
  startAutoScroll();
}

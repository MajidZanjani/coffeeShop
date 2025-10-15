export function carousel(): void {
  document.addEventListener("DOMContentLoaded", () => {
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
      const nextIndex = (index + 1) % items.length;

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

        if (indicators[i])
          indicators[i].classList.toggle("active", i === index);
      });

      adjustTrackHeight(index);
      current = index;
    }

    // --- Adjust carousel track height ---
    function adjustTrackHeight(index: number): void {
      if (!track) return;
      const activeItem = items[index];
      const setHeight = () => {
        track.style.height = `${
          activeItem.offsetHeight || activeItem.scrollHeight
        }px`;
      };
      setHeight();

      activeItem.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        if (!img.complete)
          img.addEventListener("load", setHeight, { once: true });
      });
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
    }

    function resumeAutoScroll(): void {
      if (!isPaused) return;
      isPaused = false;
      startAutoScroll(remaining > 0 ? remaining : 7000);
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

    // --- Window resize/load height adjustment ---
    const updateHeight = (): void => adjustTrackHeight(current);
    window.addEventListener("load", updateHeight);
    window.addEventListener("resize", updateHeight);

    // --- Init ---
    showSlide(0);
    startAutoScroll();
  });
}

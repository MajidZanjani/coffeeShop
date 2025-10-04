document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");
  const leftArrow = document.querySelector(".carousel-arrow.left");
  const rightArrow = document.querySelector(".carousel-arrow.right");
  const carousel = document.querySelector(".carousel");
  let current = 0;
  let autoScrollTimer = null;
  let isPaused = false;
  let lastTick = Date.now();
  let remaining = 7000;

  function showSlide(index) {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
      if (indicators[i]) indicators[i].classList.toggle("active", i === index);
    });
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % items.length);
  }

  function prevSlide() {
    showSlide((current - 1 + items.length) % items.length);
  }

  function startAutoScroll(timeout = 7000) {
    if (autoScrollTimer) clearTimeout(autoScrollTimer);
    lastTick = Date.now();
    autoScrollTimer = setTimeout(() => {
      if (!isPaused) {
        nextSlide();
        startAutoScroll(7000);
      }
    }, timeout);
  }

  function pauseAutoScroll() {
    if (isPaused) return;
    isPaused = true;
    if (autoScrollTimer) {
      clearTimeout(autoScrollTimer);
      remaining -= Date.now() - lastTick;
    }
  }

  function resumeAutoScroll() {
    if (!isPaused) return;
    isPaused = false;
    startAutoScroll(remaining > 0 ? remaining : 7000);
    remaining = 7000;
  }

  // Arrow Controls
  leftArrow.addEventListener("click", () => {
    prevSlide();
    pauseAutoScroll();
  });

  rightArrow.addEventListener("click", () => {
    nextSlide();
    pauseAutoScroll();
  });

  indicators.forEach((indicator, i) => {
    indicator.addEventListener("click", () => {
      showSlide(i);
      pauseAutoScroll();
    });
  });

  carousel.addEventListener("mouseenter", pauseAutoScroll);
  carousel.addEventListener("mouseleave", resumeAutoScroll);

  carousel.addEventListener("touchstart", pauseAutoScroll);
  carousel.addEventListener("touchend", resumeAutoScroll);

  // Swipe support (mobile)
  let startX = 0;
  let endX = 0;

  carousel.addEventListener("touchstart", (e) => {
    pauseAutoScroll();
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    resumeAutoScroll();
  });

  function handleSwipe() {
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // minimum swipe distance
      if (diff > 0) {
        nextSlide(); // swipe left → next
      } else {
        prevSlide(); // swipe right → prev
      }
    }
  }

  // init
  showSlide(0);
  startAutoScroll();
});

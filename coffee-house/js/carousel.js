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
    // normalize index
    index = (index + items.length) % items.length;

    const prevIndex = (index - 1 + items.length) % items.length;
    const nextIndex = (index + 1) % items.length;

    items.forEach((item, i) => {
      // remove existing position classes but keep any other classes intact
      item.classList.remove(
        "position-active",
        "position-prev",
        "position-next"
      );

      if (i === index) {
        // active slide sits in center
        item.classList.add("position-active");
        item.classList.add("active");
      } else {
        // remove active only if it's not the active index
        item.classList.remove("active");
      }

      if (i === prevIndex) {
        item.classList.add("position-prev");
      } else if (i === nextIndex) {
        item.classList.add("position-next");
      } else if (i !== index) {
        // keep other non-adjacent slides off-screen to the right
        item.classList.add("position-next");
      }

      if (indicators[i]) {
        indicators[i].classList.toggle("active", i === index);
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

    // adjust track/container height to match active slide to avoid layout jump
    const track = document.querySelector(".carousel-track");
    const activeItem = items[index];
    function setTrackHeight() {
      if (track && activeItem) {
        const h = activeItem.offsetHeight || activeItem.scrollHeight || 0;
        track.style.height = h + "px";
      }
    }
    setTrackHeight();

    // re-calc height after images load in case they were not ready yet
    const imgs = activeItem.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", setTrackHeight, { once: true });
      }
    });

    current = index;
  }

  // ensure height updates on window load/resize
  window.addEventListener("load", () => {
    // set initial height to first slide
    const track = document.querySelector(".carousel-track");
    const active = items[current];
    if (track && active)
      track.style.height = (active.offsetHeight || active.scrollHeight) + "px";
  });

  window.addEventListener("resize", () => {
    const track = document.querySelector(".carousel-track");
    const active = items[current];
    if (track && active)
      track.style.height = (active.offsetHeight || active.scrollHeight) + "px";
  });

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
    // Pause fill animation
    const activeFill = indicators[current]?.querySelector(".fill");
    if (activeFill) {
      const computedWidth = getComputedStyle(activeFill).width;
      const parentWidth = activeFill.parentElement.offsetWidth;
      const percent = (parseFloat(computedWidth) / parentWidth) * 100;

      activeFill.style.transition = "none";
      activeFill.style.width = percent + "%";
    }
  }

  function resumeAutoScroll() {
    if (!isPaused) return;
    isPaused = false;
    startAutoScroll(remaining > 0 ? remaining : 7000);

    // Resume fill animation
    const activeFill = indicators[current]?.querySelector(".fill");
    if (activeFill) {
      activeFill.style.transition = `width ${remaining}ms linear`;
      activeFill.style.width = "100%";
    }

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

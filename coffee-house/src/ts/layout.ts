export function layout(): void {
  // Media query script
  const mediaQuery: MediaQueryList = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );
  function updateDeviceClass(e: MediaQueryListEvent | MediaQueryList): void {
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
  mediaQuery.addEventListener("change", (e: MediaQueryListEvent) =>
    updateDeviceClass(e)
  );

  // add smooth scroll
  document
    .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    .forEach((anchor: HTMLAnchorElement): void => {
      anchor.addEventListener("click", (e: MouseEvent): void => {
        e.preventDefault();

        // Use currentTarget to get the anchor element in a type-safe way
        const targetAnchor = e.currentTarget as HTMLAnchorElement | null;
        if (!targetAnchor) return;

        const href: string | null = targetAnchor.getAttribute("href");
        if (!href) return;

        // prefer getElementById when href is a hash
        const id = href.startsWith("#") ? href.slice(1) : null;
        const target: HTMLElement | null = id
          ? document.getElementById(id)
          : document.querySelector<HTMLElement>(href);
        if (!target) return;

        const start: number = window.scrollY || window.pageYOffset;
        const end: number = target.getBoundingClientRect().top + window.scrollY;
        const duration: number = 600; // milliseconds
        const startTime: number = performance.now();

        function scrollAnimation(currentTime: number): void {
          const elapsed: number = currentTime - startTime;
          const progress: number = Math.min(elapsed / duration, 1);
          const ease: number =
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
}

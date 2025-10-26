export function burger(): void {
  const burgerBtn: HTMLElement | null = document.getElementById("burger-btn");
  const sideMenu: HTMLElement | null = document.getElementById("sideMenu");
  const menuLinks: NodeListOf<HTMLElement> | null =
    document.querySelectorAll(".side-menu li");

  if (!burgerBtn || !sideMenu) {
    console.warn("Burger button or side menu element not found.");
    return;
  }

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    sideMenu.classList.toggle("active");
    document.body.classList.toggle("burger-open");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.toggle("active");
      sideMenu.classList.toggle("active");
      document.body.classList.toggle("burger-open");
    });
  });
}

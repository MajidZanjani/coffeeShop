const burgerBtn = document.getElementById("burger-btn");
const sideMenu = document.getElementById("sideMenu");
const menuLinks = document.querySelectorAll(".side-menu li");

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

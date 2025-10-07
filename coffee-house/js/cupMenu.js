const menuLis = Array.from(document.getElementsByClassName("coffee-cup"));
const homePage = document.getElementById("home-page");
const menuPage = document.getElementById("menu-page");
const home = document.getElementById("logo");

logo.addEventListener("click", () => {
  homePage.style.display = "block";
  menuPage.style.display = "none";
  menuLis.forEach((item) => {
    item.classList.remove("inactive-cup");
  });
});

menuLis.forEach((link) => {
  link.addEventListener("click", () => {
    homePage.style.display = "none";
    menuPage.style.display = "block";
    menuLis.forEach((item) => {
      item.classList.add("inactive-cup");
    });
  });
});

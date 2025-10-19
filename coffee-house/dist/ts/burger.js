"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burger = burger;
function burger() {
    const burgerBtn = document.getElementById("burger-btn");
    const sideMenu = document.getElementById("sideMenu");
    const menuLinks = document.querySelectorAll(".side-menu li");
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

import "../styles/index.css";

import { burger } from "./burger";
import { carousel } from "./carousel";
import { catButton } from "./catButton";
import { layout } from "./layout";
import { favCoffees } from "./favCoffees";
import { getCart, renderCartEl } from "./cart";
import { registerFormInit } from "./registerForm";
import { loginFormInit } from "./loginForm";

async function loadFragment(targetId: string, file: string): Promise<void> {
  return fetch(file)
    .then((res) => res.text())
    .then((html) => {
      const el = document.getElementById(targetId);
      if (el) el.innerHTML = html;
    });
}

const isHomePage =
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/";

document.addEventListener("DOMContentLoaded", async () => {
  await loadFragment("header", "/components/header.html");
  await loadFragment("footer", "/components/footer.html");

  burger();
  layout();

  const user = localStorage.getItem("user");
  const loggedinNav: NodeListOf<HTMLElement> =
    document.querySelectorAll(".nav-loggedin");
  const loggedoutNav: NodeListOf<HTMLElement> =
    document.querySelectorAll(".nav-loggedout");
  if (user) {
    loggedinNav.forEach((el: HTMLElement) => {
      el.style.display = "none";
    });
    loggedoutNav.forEach((el: HTMLElement) => {
      el.style.display = "flex";
      el.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
      });
    });
  } else {
    loggedinNav.forEach((el: HTMLElement) => {
      el.style.display = "flex";
    });
    loggedoutNav.forEach((el: HTMLElement) => (el.style.display = "none"));
  }

  const isMenuPage = window.location.href.includes("menu.html");
  if (isMenuPage) {
    const menuLink = document.querySelector(".cup-menu");
    const sideLink = document.querySelector(".side-cup");
    if (menuLink) {
      menuLink.classList.add("inactive-cup");
      menuLink.removeAttribute("href");
    }
    if (sideLink) {
      sideLink.classList.add("inactive-cup");
      sideLink.removeAttribute("href");
    }
    catButton();
  }

  if (!isHomePage) getCart();
});

if (isHomePage) {
  carousel();
  favCoffees();
}

const isCartPage = window.location.href.includes("cart.html");
if (isCartPage) renderCartEl();

const isRegisterPage = window.location.href.includes("register.html");
if (isRegisterPage) registerFormInit();

const isLoginpage = window.location.href.includes("signin.html");
if (isLoginpage) loginFormInit();

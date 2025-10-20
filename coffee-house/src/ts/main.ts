import "../styles/index.css";

import { burger } from "./burger";
import { carousel } from "./carousel";
import { catButton } from "./catButton";
import { layout } from "./layout";
import { favCoffees } from "./favCoffees";
import { getCart, renderCartEl } from "./cart";
import { renderLogin } from "./login";

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
if (isCartPage) {
  renderCartEl();
}

const isSignInPage = window.location.href.includes("signIn.html");
if (isSignInPage) renderLogin();

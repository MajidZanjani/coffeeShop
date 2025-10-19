import "../styles/index.css";

import { burger } from "./burger";
import { carousel } from "./carousel";
import { catButton } from "./catButton";
import { layout } from "./layout";
import { favCoffees } from "./favCoffees";

function loadFragment(targetId: string, file: string): Promise<void> {
  return fetch(file)
    .then((res) => res.text())
    .then((html) => {
      const el = document.getElementById(targetId);
      if (el) el.innerHTML = html;
    });
}

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
  }

  if (isMenuPage) {
    catButton();
  } else {
    carousel();
    favCoffees();
  }
});

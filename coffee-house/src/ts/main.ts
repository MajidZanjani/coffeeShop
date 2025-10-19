import "../styles/index.css";

import { burger } from "./burger";
import { carousel } from "./carousel";
import { catButton } from "./catButton";
import { layout } from "./layout";
import { favCoffees } from "./favCoffees";

const currentPage = window.location.pathname;
if (currentPage.startsWith("/menu")) {
  catButton();
} else {
  carousel();
  favCoffees();
}

burger();
layout();

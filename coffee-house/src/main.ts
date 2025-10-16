import "./index.css";

import { burger } from "./ts/burger";
import { carousel } from "./ts/carousel";
import { catButton } from "./ts/catButton";
import { layout } from "./ts/layout";
import { modal } from "./ts/modal";
import { favCoffees } from "./ts/favCoffees";

const currentPage = window.location.pathname;
if (currentPage.startsWith("/menu")) {
  modal();
} else {
  carousel();
}

catButton();
burger();
layout();
favCoffees();

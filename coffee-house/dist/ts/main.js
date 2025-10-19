"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/index.css");
const burger_1 = require("./burger");
const carousel_1 = require("./carousel");
const catButton_1 = require("./catButton");
const layout_1 = require("./layout");
const favCoffees_1 = require("./favCoffees");
const currentPage = window.location.pathname;
if (currentPage.startsWith("/menu")) {
    (0, catButton_1.catButton)();
}
else {
    (0, carousel_1.carousel)();
    (0, favCoffees_1.favCoffees)();
}
(0, burger_1.burger)();
(0, layout_1.layout)();

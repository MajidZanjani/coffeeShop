"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favCoffees = favCoffees;
function favCoffees() {
    document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
        const carouselItems = document.querySelectorAll(".carousel-item");
        // fetch from API for favorite coffees
        try {
            const response = yield fetch("https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const coffees = data.data;
            coffees.forEach((coffee, index) => {
                const item = carouselItems[index];
                if (!item)
                    return;
                const img = item.querySelector("img");
                const title = item.querySelector(".carousel-item-title");
                const description = item.querySelector(".carousel-item-description");
                const price = item.querySelector(".carousel-item-price");
                if (img instanceof HTMLImageElement) {
                    img.src = `../img/fav-${coffee.id}.png`;
                    img.alt = coffee.name;
                }
                if (title)
                    title.textContent = coffee.name;
                if (description)
                    description.textContent = coffee.description;
                if (price)
                    price.textContent = `$${Number(coffee.price).toFixed(2)}`;
            });
        }
        catch (error) {
            console.log("Default favorite coffees show due to the fetch failor: ", error);
        }
    }));
}

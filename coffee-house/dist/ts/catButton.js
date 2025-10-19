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
exports.catButton = catButton;
const createEl_1 = require("./createEl");
const loader_1 = require("./loader");
const modal_1 = require("./modal");
function catButton() {
    let allProducts = [];
    let currentCategory = "coffee";
    let showingAll = false;
    const container = document.querySelector(".products");
    const btnMore = document.getElementById("btn-more");
    const categoryButtons = document.querySelectorAll(".cat-btn");
    const modal = document.getElementById("product-modal");
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            var _a;
            if (button.classList.contains("active") &&
                !document.querySelector(".error-element"))
                return;
            categoryButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.classList.add("inactive");
            });
            button.classList.add("active");
            button.classList.remove("inactive");
            const categoryName = (_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            handleCategoryChange(categoryName);
        });
    });
    window.addEventListener("DOMContentLoaded", () => {
        handleCategoryChange(currentCategory);
    });
    window.addEventListener("resize", updateProductView);
    function handleCategoryChange(category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (container)
                container.innerHTML = "";
            const loader = new loader_1.Loader(".products", false);
            yield loader.simulate(2000);
            try {
                const response = yield fetch("https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = yield response.json();
                if (!result)
                    return;
                allProducts = result.data.filter((p) => p.category.toLowerCase() === category);
                showingAll = false;
                updateProductView();
            }
            catch (err) {
                console.error("Error loading products:", err);
                const errorEl = (0, createEl_1.createEl)("div", "error-element", "Something went wrong. Please, refresh the page");
                container === null || container === void 0 ? void 0 : container.appendChild(errorEl);
            }
        });
    }
    function updateProductView() {
        if (!container)
            return;
        container.innerHTML = "";
        if (!btnMore) {
            console.log("Error on updateProductView: btnMore not found");
            return;
        }
        btnMore.style.display = "none";
        const isMobile = window.innerWidth <= 768;
        if (isMobile && allProducts.length > 4) {
            renderProductList(allProducts.slice(0, 4));
            btnMore.style.display = "flex";
            btnMore.onclick = () => {
                showingAll = true;
                renderProductList(allProducts);
                btnMore.style.display = "none";
            };
        }
        else {
            renderProductList(allProducts);
            btnMore.style.display = "none";
        }
    }
    function renderProductList(products) {
        if (!container)
            return;
        container.innerHTML = "";
        products.forEach((p, i) => {
            const productWrap = (0, createEl_1.createEl)("div", "product");
            productWrap.dataset.productId = String(p.id);
            const imageWrap = (0, createEl_1.createEl)("div", "image-wrapper");
            const img = document.createElement("img");
            img.src = `../img/${p.category}-${p.id}.jpg`;
            img.alt = p.name;
            imageWrap.appendChild(img);
            const productDesc = (0, createEl_1.createEl)("div", "product-description");
            const producTitle = (0, createEl_1.createEl)("div", "title", p.name);
            const productDescription = (0, createEl_1.createEl)("div", "description", p.description);
            const productPrice = (0, createEl_1.createEl)("div", "price", String(p.price));
            productDesc.append(producTitle, productDescription, productPrice);
            productWrap.append(imageWrap, productDesc);
            container.appendChild(productWrap);
        });
        const newList = container.querySelectorAll(".product");
        newList.forEach((p) => p.addEventListener("click", () => handleModalDisplay(p)));
    }
    function sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    function handleModalDisplay(productEl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${Number(productEl.dataset.productId)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = yield response.json();
                const prod = result.data;
                // Clear old modal before re-creating
                const modalContainer = document.querySelector(".modal");
                if (modalContainer)
                    modalContainer.innerHTML = "";
                (0, modal_1.modalView)(prod);
            }
            catch (err) {
                console.error("Error loading products:", err);
                const errorEl = (0, createEl_1.createEl)("div", "modal-err", "Something went wrong. Please, try again");
                productEl.appendChild(errorEl);
                yield sleep(2000);
                productEl.removeChild(errorEl);
            }
        });
    }
}

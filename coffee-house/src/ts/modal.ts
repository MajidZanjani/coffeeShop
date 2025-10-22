import { getCart, saveCart } from "./cart";
import { refreshCartIconCount } from "./catButton";
import { createEl } from "./createEl";
import { Loader } from "./loader";

interface Size {
  size: string;
  price: string;
  discountPrice: string;
}

interface Additive {
  name: string;
  price: string;
  discountPrice: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  sizes: {
    s: Size;
    m: Size;
    l: Size;
    xl: Size;
    xxl: Size;
  };
  additives: Additive[];
}

interface CartItem {
  cartId: string;
  id: number;
  name: string;
  price: string;
  discountPrice: string;
  size: string;
  additives: string[];
  image: string;
}

const user = localStorage.getItem("user");

function modalClose() {
  const overlay = document.querySelector(".modal-overlay") as HTMLElement;
  const outModal = document.querySelector(".out-modal") as HTMLElement;
  outModal.innerHTML = "";
  overlay.style.display = "none";
  overlay.classList.remove("active");
  document.body.style.overflow = "scroll";
}

async function addCartItemCount() {
  const loaderEl = document.querySelector(".loader");
  const productsEl = document.querySelector(".products-show");
  if (loaderEl && productsEl) {
    loaderEl.classList.replace("loader-hide", "loader-show");
    productsEl.classList.replace("products-show", "products-hide");
    const loader = new Loader(".loader", false);
    await loader.simulate(500);
    loaderEl.classList.replace("loader-show", "loader-hide");
    productsEl.classList.replace("products-hide", "products-show");
  }
  const cartNavEl = document.querySelector(".cart-el");
  const cartJSON = localStorage.getItem("cart");
  if (cartJSON) {
    cartNavEl?.classList.add("active");
    const cartItemCount = document.querySelector(".cart-item-count");
    if (cartItemCount)
      cartItemCount.textContent = String(JSON.parse(cartJSON).length);
    if (user) {
      let totalPrice = 0;
      let totalDiscountprice = 0;
      const cart = JSON.parse(cartJSON);
      cart.forEach((item: CartItem) => {
        totalPrice += Number(item.price);
        totalDiscountprice += Number(item.discountPrice);
      });
      const totalDiscount = totalPrice - totalDiscountprice;
      if (totalDiscount != 0) {
        const disIcon = document.querySelector(".dis-icon") as HTMLElement;
        if (disIcon) disIcon.textContent = String(totalDiscount.toFixed(2));
      }
    }
  }
}

export function modalView(product: Product): void {
  const user = localStorage.getItem("user");
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") modalClose();
  });

  const outModal = document.querySelector(".out-modal") as HTMLElement;
  const modalContainer = createEl("div", "modal");
  if (!outModal) return;
  outModal.innerHTML = "";

  const closeIcon = createEl("div", "close-btn");
  closeIcon.innerHTML = `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#C1B6AD"/>
<path d="M16.3433 16.3431L27.657 27.6568" stroke="#E1D4C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.3433 27.6569L27.657 16.3432" stroke="#E1D4C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  closeIcon.addEventListener("click", () => {
    const overlay = document.querySelector(".modal-overlay") as HTMLElement;
    outModal.innerHTML = "";
    overlay.style.display = "none";
    overlay.classList.remove("active");
  });
  outModal.append(closeIcon, modalContainer);

  // Clear any existing modal content
  modalContainer.innerHTML = "";

  // === Modal Image ===
  const modalImageWrap = createEl("div", "modal-image");
  const modalImg = document.createElement("img");
  modalImg.src = `../img/${product.category}-${product.id}.jpg`;
  modalImg.alt = product.name;
  modalImageWrap.appendChild(modalImg);

  // === Modal Content ===
  const modalContent = createEl("div", "modal-content");

  const title = createEl("div", "modal-title", product.name);
  const description = createEl("div", "modal-description", product.description);

  // === Size Options ===
  const modalSizes = createEl("div", "modal-sizes");
  const sizeTitle = createEl("div", "size-title", "Size");
  const sizeOptions = createEl("div", "size-options");

  const sizeMap: Record<string, string> = {
    s: "Small",
    m: "Medium",
    l: "Large",
    xl: "XL",
    xxl: "XXL",
  };

  Object.entries(product.sizes).forEach(([key, sizeData], i) => {
    const btn = createEl("button", `size size-${key}`) as HTMLButtonElement;
    btn.dataset.originalPrice = String(sizeData.price);
    if (sizeData.discountPrice)
      btn.dataset.price = String(sizeData.discountPrice);
    if (i === 0) btn.classList.add("active"); // default first one active
    const span = createEl("span", "", key.toUpperCase());
    const sizeText = document.createElement(`size-${key}`);
    sizeText.textContent = sizeData.size;

    btn.append(span, sizeText);
    sizeOptions.appendChild(btn);
  });

  modalSizes.append(sizeTitle, sizeOptions);

  // === Additives ===
  const modalAdditives = createEl("div", "modal-additives");
  const addTitle = createEl("div", "add-title", "Additives");
  const additivesWrap = createEl("div", "additives");

  product.additives.forEach((add, i) => {
    const btn = createEl(
      "button",
      `additive add-${i + 1}`
    ) as HTMLButtonElement;
    btn.dataset.originalPrice = String(add.price);
    if (add.discountPrice) btn.dataset.price = String(add.discountPrice);
    const span = createEl("span", "", (i + 1).toString());
    btn.append(span, document.createTextNode(" " + add.name));
    additivesWrap.appendChild(btn);
  });

  modalAdditives.append(addTitle, additivesWrap);

  // === Total ===
  const totalWrap = createEl("div", "total");
  const totalLabel = createEl("span", "", "Total:");

  const totalValue = createEl(
    "strong",
    "normal",
    `$${Number(product.price).toFixed(2)}`
  );
  if (user) {
    const totalDiscountedValue = createEl(
      "strong",
      "discount",
      `$${Number(product.discountPrice).toFixed(2)}`
    );
    totalValue.classList.add("strike");
    totalWrap.append(totalLabel, totalValue, totalDiscountedValue);
    totalWrap.style.gridTemplateColumns = "2fr 1fr 1fr";
  } else {
    totalWrap.append(totalLabel, totalValue);
  }

  // Add to Cart ******************
  const addToCart = createEl("button", "close-bottom-btn", "Add to cart");
  addToCart.addEventListener("click", () => {
    const activeSizeEl = modalContainer.querySelector(".size.active");

    const selectedSize = activeSizeEl
      ? activeSizeEl.className.match(/size-(\w+)/)?.[1]?.toUpperCase() ||
        "DEFAULT"
      : "DEFAULT";

    const activeAdditives = Array.from(
      modalContainer.querySelectorAll(".additive.active")
    ).map((btn) => btn.textContent?.replace(/^\d+\s*/, "") || "");

    const totalEl = modalContainer.querySelector(".normal") as HTMLElement;
    const totalDiscountEl = modalContainer.querySelector(
      ".discount"
    ) as HTMLElement;

    const totalPrice = Number(
      totalEl.textContent?.replace("$", "") || product.price
    );
    let totalDiscountPrice = totalPrice;
    if (totalDiscountEl) {
      totalDiscountPrice = Number(
        totalDiscountEl.textContent?.replace("$", "")
      );
    }

    const cart = getCart();
    addCartItemCount();

    const cartId = String(Date.now());

    const newItem: CartItem = {
      cartId: cartId,
      id: product.id,
      name: product.name,
      price: String(totalPrice),
      discountPrice: String(totalDiscountPrice),
      size: selectedSize,
      additives: activeAdditives,
      image: `../img/${product.category}-${product.id}.jpg`,
    };
    cart.push(newItem);

    saveCart(cart);
    getCart();
    modalClose();
  });

  modalContent.append(
    title,
    description,
    modalSizes,
    modalAdditives,
    totalWrap,
    addToCart
  );

  // Inject image and content into modal
  modalContainer.append(modalImageWrap, modalContent);

  // === Attach Events ===
  const sizes = modalContainer.querySelectorAll<HTMLElement>(".size");
  const additives = modalContainer.querySelectorAll<HTMLElement>(".additive");
  const totalEl = modalContainer.querySelector(".normal") as HTMLElement;
  const totalDiscountEl = modalContainer.querySelector(
    ".discount"
  ) as HTMLElement;

  // Calculate on each select/unselect
  function calculateTotal(): void {
    let basePrice = parseFloat(product.price);
    let baseDiscountPrice =
      parseFloat(product.discountPrice) || parseFloat(product.price);

    const activeSizeEl = modalContainer.querySelector(".size.active");
    if (activeSizeEl) {
      const sizeKey = activeSizeEl.className.includes("size-s")
        ? "s"
        : activeSizeEl.className.includes("size-m")
        ? "m"
        : activeSizeEl.className.includes("size-l")
        ? "l"
        : activeSizeEl.className.includes("size-xl")
        ? "xl"
        : "xxl";

      const sizeOption = product.sizes[sizeKey];
      if (sizeOption) {
        baseDiscountPrice =
          parseFloat(sizeOption.discountPrice) || parseFloat(sizeOption.price);
        basePrice = parseFloat(sizeOption.price);
      }
    }

    let additivePrice = 0;
    let additiveDiscountPrice = 0;
    const activeAdditives = Array.from(
      modalContainer.querySelectorAll(".additive.active")
    ).map((btn) => btn.textContent?.replace(/^\d+\s*/, "") || "");

    activeAdditives.forEach((name) => {
      const add = product.additives.find((a) => a.name === name);
      if (add) {
        additiveDiscountPrice = add.discountPrice
          ? additiveDiscountPrice + parseFloat(add.discountPrice)
          : additiveDiscountPrice + parseFloat(add.price);
        additivePrice += parseFloat(add.price);
      }
    });

    const total = basePrice + additivePrice;
    const totalDiscount = baseDiscountPrice + additiveDiscountPrice;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (totalDiscountEl)
      totalDiscountEl.textContent = `$${totalDiscount.toFixed(2)}`;
  }

  sizes.forEach((size) => {
    size.addEventListener("click", () => {
      sizes.forEach((s) => s.classList.remove("active"));
      size.classList.add("active");
      calculateTotal();
    });
  });

  additives.forEach((add) => {
    add.addEventListener("click", () => {
      add.classList.toggle("active");
      calculateTotal();
    });
  });

  calculateTotal();

  // === OPEN MODAL ===
  const overlay = document.querySelector(".modal-overlay") as HTMLElement;
  if (overlay) {
    overlay.classList.add("active");
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // === CLOSE EVENTS ===
  addToCart.addEventListener("click", () => {
    modalClose();
  });

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      modalClose();
    }
  });

  // tooltip
  const sizeElements = document.querySelectorAll<HTMLDivElement>(".size");
  const addElements = document.querySelectorAll<HTMLDivElement>(".additive");

  sizeElements.forEach((size) => {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
    size.addEventListener("mouseenter", () => {
      const price = size.dataset.price;
      const originalPrice = size.dataset.originalPrice;
      if (user && price) {
        tooltip.innerHTML = `<s>$${originalPrice}</s> - $${price}`;
      } else {
        tooltip.textContent = `$${originalPrice}`;
      }
      const rect = size.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.classList.add("show");
    });
    size.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });

  addElements.forEach((add) => {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
    add.addEventListener("mouseenter", () => {
      const price = add.dataset.price;
      const originalPrice = add.dataset.originalPrice;
      if (user && price) {
        tooltip.innerHTML = `<s>$${originalPrice}</s> - $${price}`;
      } else {
        tooltip.textContent = `$${originalPrice}`;
      }

      const rect = add.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.classList.add("show");
    });

    add.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
}

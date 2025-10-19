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

function modalClose() {
  const overlay = document.querySelector(".modal-overlay") as HTMLElement;
  const outModal = document.querySelector(".out-modal") as HTMLElement;
  outModal.innerHTML = "";
  overlay.style.display = "none";
  overlay.classList.remove("active");
}

export function modalView(product: Product): void {
  console.log(product);

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
    "",
    `$${Number(product.discountPrice || product.price).toFixed(2)}`
  );
  totalWrap.append(totalLabel, totalValue);

  const addToCart = createEl("button", "close-bottom-btn", "Add to cart");
  addToCart.addEventListener("click", () => {
    const overlay = document.querySelector(".modal-overlay") as HTMLElement;
    overlay?.classList.remove("active");
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
  const totalEl = modalContainer.querySelector(".total strong") as HTMLElement;

  function calculateTotal(): void {
    let basePrice = parseFloat(product.discountPrice || product.price);

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
        basePrice = parseFloat(sizeOption.discountPrice || sizeOption.price);
      }
    }

    let additivePrice = 0;
    const activeAdditives = Array.from(
      modalContainer.querySelectorAll(".additive.active")
    ).map((btn) => btn.textContent?.replace(/^\d+\s*/, "") || "");

    activeAdditives.forEach((name) => {
      const add = product.additives.find((a) => a.name === name);
      if (add) {
        additivePrice += parseFloat(add.discountPrice || add.price);
      }
    });

    const total = basePrice + additivePrice;
    totalEl.textContent = `$${total.toFixed(2)}`;
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
}

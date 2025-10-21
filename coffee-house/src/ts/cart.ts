import { createEl } from "./createEl";
import { Loader } from "./loader";

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

const userJSON = localStorage.getItem("user");
const user = userJSON ? JSON.parse(userJSON) : null;

// --- Utility functions ---
const $ = (selector: string): HTMLElement | null =>
  document.querySelector(selector);

const $$ = (selector: string): NodeListOf<HTMLElement> =>
  document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

// --- LocalStorage helpers ---
export function getCart(): CartItem[] {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Cart Initialization ---
async function cartInit(): Promise<void> {
  const loaderEl = $(".loader");
  const cartNavEl = $(".cart-el");
  const cart = getCart();

  if (loaderEl) {
    loaderEl.classList.add("loader-show");
    const loader = new Loader(".loader", false);
    await loader.simulate(2000);
    loaderEl.classList.replace("loader-show", "loader-hide");
  }

  if (cart.length > 0) {
    cartNavEl?.classList.add("active");
    updateCartCount(cart.length);
  }
}

// --- Update Cart Item Count ---
function updateCartCount(count: number): void {
  const countEl = $(".cart-item-count");
  if (countEl) countEl.textContent = String(count);
}

// --- Remove Item from Cart ---
function removeFromCart(id: string): void {
  const cart = getCart().filter((item) => item.cartId !== id);
  saveCart(cart);
  updateCartCount(cart.length);
  renderItems(); // re-render cart list instantly
}

// --- Render Cart Items ---
async function renderItems(): Promise<void> {
  const cartItemsEl = $(".cart-items");
  const confirmBtn = $(".cart-confirm");

  if (!cartItemsEl) return;

  const cartItems = getCart();
  cartItemsEl.innerHTML = ""; // clear existing items

  if (cartItems.length === 0) {
    if (confirmBtn) confirmBtn.style.display = "none";
    return;
  }

  if (user && confirmBtn) confirmBtn.style.display = "";

  let totalPrice = 0;
  let totalDiscountPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += Number(item.price);
    totalDiscountPrice += Number(item.discountPrice);

    const cartItemEl = createEl("div", "cart-item");

    // --- Trash icon ---
    const trashEl = createEl("div", "cart-item-trash");
    trashEl.dataset.id = String(item.id);
    trashEl.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
          stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375"
          stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
    trashEl.addEventListener("click", () => removeFromCart(item.cartId));

    // --- Image ---
    const imgEl = createEl("div", "cart-item-image");
    imgEl.innerHTML = `<img src="${item.image}" alt="${item.name}">`;

    // --- Description ---
    const descEl = createEl("div", "cart-item-desc");
    const nameEl = createEl("div", "cart-item-name", item.name);
    const detailText = [`Size "${item.size}"`, ...(item.additives || [])].join(
      ", "
    );
    const detailEl = createEl("div", "cart-item-detail", detailText);
    descEl.append(nameEl, detailEl);

    // --- Price ---
    const priceEl = createEl("div", "cart-item-price");
    const normalEl = createEl(
      "span",
      "normal",
      `$${Number(item.price).toFixed(2)}`
    );
    const discountEl = createEl(
      "span",
      "discount",
      `$${Number(item.discountPrice).toFixed(2)}`
    );
    if (user) normalEl.classList.add("strike");
    else discountEl.classList.add("show-user");

    priceEl.append(normalEl, discountEl);

    // --- Combine elements ---
    cartItemEl.append(trashEl, imgEl, descEl, priceEl);
    cartItemsEl.append(cartItemEl);
  });

  // --- Update totals ---
  const totalEl = $(".normal-total.normal");
  const discountTotalEl = $(".discount-total.discount");

  if (totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)}`;
  if (discountTotalEl)
    discountTotalEl.textContent = `$${totalDiscountPrice.toFixed(2)}`;
}

// --- Render Cart Controls and User Info ---
export async function renderCartEl(): Promise<void> {
  const signInBtn = $(".cart-sign-in");
  const registerBtn = $(".cart-register");
  const confirmBtn = $(".cart-confirm");
  const btnsEl = $(".cart-buttons");

  signInBtn?.addEventListener(
    "click",
    () => (window.location.href = "signIn.html")
  );
  registerBtn?.addEventListener(
    "click",
    () => (window.location.href = "register.html")
  );

  if (user && btnsEl) {
    btnsEl.style.gridTemplateColumns = "auto";
    $$(".show-user").forEach((el) => el.classList.remove("show-user"));

    // Strike through normal prices if discounts exist
    $$(".normal").forEach((el) => {
      const next = el.nextSibling as HTMLElement | null;
      if (next?.textContent) el.classList.add("strike");
    });

    // Set address and payment info
    const addressEl = $(".cart-address-text");
    const methodEl = $(".cart-method-text");
    if (addressEl)
      addressEl.textContent = `${user.city}, ${user.street}, ${user.houseNumber}`;
    if (methodEl) {
      const paymentMethod =
        user.paymentMethod.charAt(0).toUpperCase() +
        user.paymentMethod.slice(1);
      methodEl.textContent = paymentMethod;
    }
    confirmBtn?.classList.remove("show-user");
    signInBtn?.classList.add("show-user");
    registerBtn?.classList.add("show-user");
  }
}

// --- Initialize Page ---
(async function initPage() {
  await cartInit();
  await renderCartEl();
  await renderItems();

  // if (user) {
  //   $$(".show-user").forEach((el) => el.classList.remove("show-user"));
  // }
})();

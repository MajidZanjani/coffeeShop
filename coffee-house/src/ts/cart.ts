import { createEl } from "./createEl";

interface CartItem {
  id: number;
  name: string;
  price: string;
  size: string;
  additives: string[];
  quantity: number;
  image: string;
}

// Retrieve Local Storage ******************
export function getCart(): CartItem[] {
  const cart = localStorage.getItem("cart");
  if (cart) {
    const cartArray = JSON.parse(cart);
    const cartNavEl = document.querySelector(".cart-el");
    cartNavEl?.classList.add("active");
    const cartItemCount = document.querySelector(".cart-item-count");
    if (cartItemCount) {
      let Itemcount = 0;
      cartArray.forEach((element: CartItem) => {
        Itemcount += element.quantity;
      });
      cartItemCount.textContent = String(Itemcount);
    }
  }
  return cart ? JSON.parse(cart) : [];
}

// Store Cart on Local Storage ******************
export function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function renderItems(): Promise<void> {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    const cartItemsEl = document.querySelector(".cart-items");
    const cartItems: CartItem[] = JSON.parse(cartData);

    cartItems.forEach((cartItem) => {
      const trashEl = document.createElement("div");
      trashEl.classList.add("cart-item-trash");
      trashEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
                  stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375"
                  stroke="#403F3D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>`;
      const cartItemEl = createEl("div", "cart-item");
      cartItemEl.append(trashEl);

      const cartItemImageEl = createEl("div", "cart-item-image");
      cartItemImageEl.innerHTML = `<img src='${cartItem.image}' alt=$"{cartItem.name}">`;
      cartItemEl.append(cartItemImageEl);

      const cartItemDescEl = createEl("div", "cart-item-desc");
      const cartItemNameEl = createEl("div", "cart-item-name", cartItem.name);
      let description = cartItem.size;
      if (cartItem.additives) {
        cartItem.additives.forEach((additive) => {
          description += `, ${additive}`;
        });
      }
      const cartItemDetailEl = createEl("div", "cart-item-detail", description);
      cartItemDescEl.append(cartItemNameEl);
      cartItemDescEl.append(cartItemDetailEl);
      cartItemEl.append(cartItemDescEl);

      const cartItemPriceEl = createEl("div", "cart-item-price");
      const cartItemNormalPriceEl = createEl(
        "span",
        "normal strike",
        `$${Number(cartItem.price).toFixed(2)}`
      );
      const cartItemDiscountPriceEl = createEl(
        "span",
        "discount show-user",
        `$${Number(cartItem.price).toFixed(2)}`
      );
      cartItemPriceEl.append(cartItemNormalPriceEl, cartItemDiscountPriceEl);
      cartItemEl.append(cartItemPriceEl);

      cartItemsEl?.append(cartItemEl);
    });
    console.log(cartItemsEl);
  }
}

export async function renderCartEl(): Promise<void> {
  await renderItems();

  const signInBtn = document.querySelector(".cart-sign-in");
  signInBtn?.addEventListener("click", () => {
    window.location.href = "signIn.html";
  });

  const registerBtn = document.querySelector(".cart-register");
  registerBtn?.addEventListener("click", () => {
    window.location.href = "register.html";
  });

  const confirmBtn = document.querySelector(".cart-confirm");
  confirmBtn?.addEventListener("click", () => {});

  const btnsEl = document.querySelector(".cart-buttons") as HTMLElement;

  // --- Change elements style on user logged in ---
  const user = localStorage.getItem("user");
  if (user) {
    btnsEl.style.gridTemplateColumns = "auto";
    const loggedElements = document.querySelectorAll(".show-user");
    loggedElements.forEach((el) => {
      el.classList.remove("show-user");
    });
    confirmBtn?.classList.remove("show-user");
    signInBtn?.classList.add("show-user");
    registerBtn?.classList.add("show-user");

    const normalPriceEl = document.querySelectorAll(
      ".normal"
    ) as NodeListOf<HTMLElement>;

    normalPriceEl.forEach((el: HTMLElement) => {
      const discountNode = el.nextSibling?.nextSibling as HTMLElement;
      if (discountNode && discountNode.innerText) {
        el.classList.add("strike");
      }
    });
  }
}

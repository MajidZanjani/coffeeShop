interface CartItem {
  id: number;
  name: string;
  price: string;
  size: string;
  additives: string[];
  quantity: number;
  image: string;
}

// Local Storage ******************
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
export function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function renderCartEl(): void {
  const signInBtn = document.querySelector(".cart-sign-in");
  signInBtn?.addEventListener("click", () => {
    window.location.href = "signIn.html";
  });

  const registerBtn = document.querySelector(".cart-register");
  registerBtn?.addEventListener("click", () => {
    window.location.href = "register.html";
  });
}

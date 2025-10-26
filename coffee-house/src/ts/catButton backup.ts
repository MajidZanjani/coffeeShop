import { createEl } from "./createEl";
import { Loader } from "./loader";
import { fetchShow } from "./modal";

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

export function refreshCartIconCount(): void {
  const cartNavEl = document.querySelector(".cart-el");
  const cartJSON = localStorage.getItem("cart");
  if (cartJSON) {
    const cart = JSON.parse(cartJSON);
    if (user || (!user && cart.length != 0)) {
      cartNavEl?.classList.add("active");
      const cartItemCount = document.querySelector(
        ".cart-item-count"
      ) as HTMLElement;
      if (cartItemCount) {
        cartItemCount.textContent = String(cart.length);
      }
    }
    if (user) {
      let totalPrice = 0;
      let totalDiscountprice = 0;
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

export function catButton(): void {
  let allProducts: Product[] = [];
  const currentCategory: string = "coffee";

  const container: HTMLElement | null =
    document.querySelector<HTMLElement>(".products");
  const btnMore: HTMLElement | null = document.getElementById(
    "btn-more"
  ) as HTMLElement;
  const categoryButtons: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>(".cat-btn");

  categoryButtons.forEach((button: HTMLElement): void => {
    button.addEventListener("click", (): void => {
      if (
        button.classList.contains("active") &&
        !document.querySelector(".error-element")
      )
        return;
      categoryButtons.forEach((btn: HTMLElement): void => {
        btn.classList.remove("active");
        btn.classList.add("inactive");
      });
      button.classList.add("active");
      button.classList.remove("inactive");

      const categoryName: string | undefined = button.textContent
        ?.trim()
        .toLowerCase();
      handleCategoryChange(categoryName);
    });
  });

  handleCategoryChange(currentCategory);

  window.addEventListener("resize", updateProductView);

  async function handleCategoryChange(category: string): Promise<void> {
    if (container) container.innerHTML = "";

    const loaderEl = document.querySelector(".loader");
    if (loaderEl) {
      loaderEl.classList.replace("loader-hide", "loader-show");
      const loader = new Loader(".loader", false);
      await loader.simulate(500);
      loaderEl.classList.replace("loader-show", "loader-hide");
    }

    refreshCartIconCount();
    try {
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!result) return;
      allProducts = result.data.filter(
        (p: Product) => p.category.toLowerCase() === category
      );
      // showingAll = false;
      updateProductView();
    } catch (err) {
      console.error("Error loading products:", err);
      const errorEl = createEl(
        "div",
        "error-element",
        "Something went wrong. Please, refresh the page"
      );
      container?.appendChild(errorEl);
    }
  }

  function updateProductView(): void {
    if (!container) return;
    container.innerHTML = "";
    if (!btnMore) {
      console.log("Error on updateProductView: btnMore not found");
      return;
    }
    btnMore.style.display = "none";

    const isMobile: boolean = window.innerWidth <= 768;

    if (isMobile && allProducts.length > 4) {
      renderProductList(allProducts.slice(0, 4));
      btnMore.style.display = "flex";
      btnMore.onclick = (): void => {
        // showingAll = true;
        renderProductList(allProducts);
        btnMore!.style.display = "none";
      };
    } else {
      renderProductList(allProducts);
      btnMore.style.display = "none";
    }
  }

  function renderProductList(products: Product[]): void {
    if (!container) return;
    container.innerHTML = "";

    products.forEach((p) => {
      const productWrap = createEl("div", "product");
      productWrap.dataset.productId = String(p.id);

      const imageWrap = createEl("div", "image-wrapper");
      const img = document.createElement("img");
      img.src = `../img/${p.category}-${p.id}.jpg`;
      img.alt = p.name;
      imageWrap.appendChild(img);

      const productDesc = createEl("div", "product-description");
      const producTitle = createEl("div", "title", p.name);
      const productDescription = createEl("div", "description", p.description);
      const productPrice = createEl("div", "price");
      const normalPeiceEl = createEl("div", "normal", `$${p.price}`);
      if (p.discountPrice && user) {
        const discountPriceEl = createEl(
          "div",
          "discount",
          `$${p.discountPrice}`
        );
        normalPeiceEl.classList.add("strike");
        productPrice.append(discountPriceEl);
        productPrice.append(normalPeiceEl);
        productDesc.append(producTitle, productDescription, productPrice);
      } else {
        productPrice.append(normalPeiceEl);
        productDesc.append(producTitle, productDescription, productPrice);
      }

      productWrap.append(imageWrap, productDesc);
      container.appendChild(productWrap);
    });

    const newList: NodeListOf<HTMLElement> =
      container.querySelectorAll<HTMLElement>(".product");
    newList.forEach((p: HTMLElement): void =>
      p.addEventListener("click", (): Promise<void> => handleModalDisplay(p))
    );
  }

  async function handleModalDisplay(productEl: HTMLElement): Promise<void> {
    await fetchShow(productEl);
  }
}

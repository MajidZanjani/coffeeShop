import { createEl } from "./createEl";
import { Loader } from "./loader";
import { modalView } from "./modal";

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

const user = localStorage.getItem("user");

export function catButton(): void {
  let allProducts: Product[] = [];
  let currentCategory: string = "coffee";
  let showingAll: boolean = false;

  const container: HTMLElement | null =
    document.querySelector<HTMLElement>(".products");
  const btnMore: HTMLElement | null = document.getElementById(
    "btn-more"
  ) as HTMLElement;
  const categoryButtons: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>(".cat-btn");
  const modal: HTMLElement | null = document.getElementById(
    "product-modal"
  ) as HTMLElement;

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
    const loader = new Loader(".products", false);
    await loader.simulate(2000);
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
      showingAll = false;
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
        showingAll = true;
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

    products.forEach((p, i) => {
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

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleModalDisplay(productEl: HTMLElement): Promise<void> {
    try {
      const response = await fetch(
        `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${Number(
          productEl.dataset.productId
        )}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const prod = result.data;

      // Clear old modal before re-creating
      const modalContainer = document.querySelector(".modal") as HTMLElement;
      if (modalContainer) modalContainer.innerHTML = "";

      modalView(prod);
    } catch (err) {
      console.error("Error loading products:", err);
      const errorEl = createEl(
        "div",
        "modal-err",
        "Something went wrong. Please, try again"
      );
      productEl.appendChild(errorEl);
      await sleep(2000);
      productEl.removeChild(errorEl);
    }
  }
}

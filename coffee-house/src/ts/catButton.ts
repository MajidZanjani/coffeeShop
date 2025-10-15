interface Size {
  size: string;
}

interface Additive {
  name: string;
}

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: {
    s: Size;
    m: Size;
    l: Size;
  };
  additives: Additive[];
}

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
  const closeBottomBtn: HTMLElement | null =
    document.querySelector<HTMLElement>(".close-bottom-btn");

  categoryButtons.forEach((button: HTMLElement): void => {
    button.addEventListener("click", (): void => {
      categoryButtons.forEach((btn: HTMLElement): void => {
        btn.classList.remove("active");
        btn.classList.add("inactive");
      });
      button.classList.add("active");
      button.classList.remove("inactive");

      const categoryName: string | undefined = button.textContent
        ?.trim()
        .toLowerCase();
      if (categoryName) handleCategoryChange(categoryName);
    });
  });

  window.addEventListener("DOMContentLoaded", () => {
    handleCategoryChange(currentCategory);
  });

  window.addEventListener("resize", updateProductView);

  async function handleCategoryChange(category: string): Promise<void> {
    try {
      const response = await fetch("src/data/products.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      allProducts = data.filter((p) => p.category.toLowerCase() === category);
      showingAll = false;
      updateProductView();
    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  function renderProductList(products: Product[]): void {
    if (!container) return;

    container.innerHTML = products
      .map(
        (p: Product): string => `
      <div class="product">
        <div class="image-wrapper">
          <img src="./src/img/${p.image}" alt="${p.name}">
        </div>
        <div class="product-description">
          <div class="title">${p.name}</div>
          <div class="description">${p.description}</div>
          <div class="price">$${p.price}</div>
        </div>
      </div>
    `
      )
      .join("");

    const newList: NodeListOf<HTMLElement> =
      container.querySelectorAll<HTMLElement>(".product");
    newList.forEach((p: HTMLElement): void =>
      p.addEventListener("click", (): void => handleModalDisplay(p))
    );
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

  const closeModal = (): void => {
    modal
      .querySelectorAll<HTMLElement>(
        ".size-small, .size-medium, .size-large, .additive"
      )
      .forEach((el: HTMLElement): void => el.classList.remove("active"));
    modal.querySelector<HTMLElement>(".size-small")?.classList.add("active");
    document.body.style.overflow = "";
    modal.style.display = "none";
  };

  closeBottomBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", (e: MouseEvent): void => {
    if ((e.target as HTMLElement) === modal) closeModal();
  });

  function handleModalDisplay(product: HTMLElement): void {
    document.body.style.overflow = "hidden";

    const prodName = product.querySelector(".title")?.textContent?.trim();
    if (!prodName) return console.warn("Product title not found");

    const p = allProducts.find((prod) => prod.name === prodName);
    if (!p) return console.warn("Product not found", prodName);

    if (!modal) return console.warn("Modal element missing");
    modal.style.display = "flex";

    modal.querySelector<HTMLElement>(".modal-title")!.textContent = p.name;
    modal.querySelector<HTMLElement>(".modal-description")!.textContent =
      p.description;

    modal.querySelector<HTMLElement>(".size-small")!.textContent =
      p.sizes.s.size;
    modal.querySelector<HTMLElement>(".size-medium")!.textContent =
      p.sizes.m.size;
    modal.querySelector<HTMLElement>(".size-large")!.textContent =
      p.sizes.l.size;

    modal.querySelector<HTMLElement>(
      ".add-1"
    )!.innerHTML = `<span>1</span> ${p.additives[0].name}`;
    modal.querySelector<HTMLElement>(
      ".add-2"
    )!.innerHTML = `<span>2</span> ${p.additives[1].name}`;
    modal.querySelector<HTMLElement>(
      ".add-3"
    )!.innerHTML = `<span>3</span> ${p.additives[2].name}`;

    modal.querySelector<HTMLElement>(
      ".total strong"
    )!.innerHTML = `$${p.price}`;

    const imageEl = modal.querySelector<HTMLImageElement>("img");
    if (imageEl) {
      imageEl.src = `./src/img/${p.image}`;
      imageEl.alt = p.name;
    }
  }
}

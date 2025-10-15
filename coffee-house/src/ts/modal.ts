interface ProductAdditive {
  name: string;
  "add-price": number;
}

interface ProductSizeOption {
  "add-price": number;
}

interface ProductSizes {
  s?: ProductSizeOption;
  m?: ProductSizeOption;
  l?: ProductSizeOption;
  [key: string]: ProductSizeOption | undefined;
}

interface Product {
  name: string;
  price: number;
  additives: ProductAdditive[];
  sizes: ProductSizes;
}

export function modal(): void {
  const sizes: NodeListOf<HTMLElement> = document.querySelectorAll(".size");
  const additives: NodeListOf<HTMLElement> =
    document.querySelectorAll(".additive");
  const modalTitle: HTMLElement | null = document.querySelector(".modal-title");
  const totalEl: HTMLElement | null = document.querySelector(".total strong");

  if (!modalTitle || !totalEl) {
    console.warn("Modal title or total element not found.");
    return;
  }

  async function getProduct(): Promise<Product | undefined> {
    if (!modalTitle) {
      console.warn("Modal title element not found.");
      return undefined;
    }
    const productName: string = modalTitle.innerHTML;
    try {
      const response = await fetch("src/data/products.json");
      const data: Product[] = await response.json();
      const product: Product | undefined = data.find(
        (p: Product): boolean => p.name === productName
      );
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  async function calculateTotal(): Promise<void> {
    let totalPrice: number = 0;
    let additivePrice: number = 0;
    let sizePrice: number = 0;

    const activeSize: HTMLElement | null =
      document.querySelector(".size.active");
    if (!activeSize) return;

    const size: string = activeSize.classList.contains("size-small")
      ? "s"
      : activeSize.classList.contains("size-medium")
      ? "m"
      : "l";

    const activeAdditives: string[] = Array.from(
      document.querySelectorAll(".additive.active")
    ).map((btn) => btn.textContent?.replace(/^\d+\s*/, ""));

    const product = await getProduct();
    if (!product) return;

    activeAdditives.forEach((name) => {
      product.additives.forEach((add) => {
        if (add.name === name) {
          additivePrice += Number(add["add-price"]);
        }
      });
    });

    if (size != "s") {
      sizePrice = Number(product.sizes[size]!["add-price"]);
    }
    totalPrice = Number(product.price) + sizePrice + additivePrice;
    if (!totalEl) {
      console.warn("Total price element not found.");
      return undefined;
    }
    totalEl.textContent = `$${totalPrice.toFixed(2)}`;
  }

  sizes.forEach((size) => {
    size.addEventListener("click", () => {
      sizes.forEach((s) => s.classList.remove("active"));
      size.classList.add("active");
      calculateTotal();
    });
  });

  additives.forEach((additive) => {
    additive.addEventListener("click", () => {
      additive.classList.toggle("active");
      calculateTotal();
    });
  });
}

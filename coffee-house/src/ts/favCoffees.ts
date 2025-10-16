interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

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

function delay(s: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, s));
}

export function favCoffees(): void {
  let productsData: Product[];
  document.addEventListener("DOMContentLoaded", async () => {
    const carouselItems: NodeListOf<HTMLElement> =
      document.querySelectorAll(".carousel-item");

    // fetch from API for favorite coffees
    try {
      // fetching products from local json file to access favorite coffee images
      try {
        const productsResponse = await fetch("src/data/products.json");
        if (!productsResponse.ok) {
          throw new Error(`products.json: ${productsResponse.status}`);
        }
        productsData = await productsResponse.json();
      } catch (error) {
        console.log("Error loading coffee image: ", error);
      }

      const response = await fetch(
        "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/favorites"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const coffees: Coffee[] = data.data;

      coffees.forEach((coffee, index) => {
        const item: HTMLElement | null = carouselItems[index];
        if (!item) return;

        const img: HTMLImageElement | null = item.querySelector("img");
        const title: HTMLElement | null = item.querySelector(
          ".carousel-item-title"
        );
        const description: HTMLElement | null = item.querySelector(
          ".carousel-item-description"
        );

        const price: HTMLElement | null = item.querySelector(
          ".carousel-item-price"
        );

        if (img instanceof HTMLImageElement) {
          const product: Product | undefined = productsData.find(
            (p: Product) => p.name === coffee.name
          );
          if (!product) return;
          img.src = `src/img/${product.image}`;
          img.alt = coffee.name;
        }
        if (title) title.textContent = coffee.name;
        if (description) description.textContent = coffee.description;
        if (price) price.textContent = `$${Number(coffee.price).toFixed(2)}`;
      });
    } catch (error) {
      console.log("Error loading favorite coffees: ", error);
    }
  });
}

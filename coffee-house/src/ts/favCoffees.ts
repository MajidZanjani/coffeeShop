interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export function favCoffees(): void {
  document.addEventListener("DOMContentLoaded", async () => {
    const carouselItems: NodeListOf<HTMLElement> =
      document.querySelectorAll(".carousel-item");

    // fetch from API for favorite coffees
    try {
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites"
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
          img.src = `../img/fav-${coffee.id}.png`;
          img.alt = coffee.name;
        }
        if (title) title.textContent = coffee.name;
        if (description) description.textContent = coffee.description;
        if (price) price.textContent = `$${Number(coffee.price).toFixed(2)}`;
      });
    } catch (error) {
      console.log(
        "Default favorite coffees show due to the fetch failor: ",
        error
      );
    }
  });
}

import { createEl } from "./createEl";

function createArrow(direction: "left" | "right"): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = `carousel-arrow ${direction}`;
  btn.setAttribute("aria-label", direction === "left" ? "Previous" : "Next");

  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      ${
        direction === "left"
          ? `<path d="M18.5 12H6M6 12L12 6M6 12L12 18" 
               stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />`
          : `<path d="M6 12H18.5M18.5 12L12.5 6M18.5 12L12.5 18"
               stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />`
      }
    </svg>`;
  return btn;
}

export function renderCarousel(): void {
  const container = document.querySelector(".fav-coffee");
  if (!container) return;

  const title = createEl("div", "fav-title");

  const span1 = createEl("span", "fav-title", "Choose your");
  const span2 = createEl("span", "fav-title-light accent", " favorite ");
  const span3 = createEl("span", "fav-title", "coffee");
  title.append(span1, span2, span3);

  const carousel = createEl("div", "carousel");
  const leftArrow = createArrow("left");
  const rightArrow = createArrow("right");

  const track = createEl("div", "carousel-track");

  // Load default carousel items in case of API fetch fails
  const items = [
    {
      img: "../img/coffee-slider-1.png",
      title: "S'mores Frappuccino",
      desc: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50",
    },
    {
      img: "../img/coffee-slider-2.png",
      title: "Caramel Macchiato",
      desc: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
      price: "$5.00",
    },
    {
      img: "../img/coffee-slider-3.png",
      title: "Ice coffee",
      desc: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
      price: "$4.50",
    },
  ];

  items.forEach((p, i) => {
    const item = createEl("div", `carousel-item${i === 0 ? " active" : ""}`);
    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.title;
    const h3Title = createEl("h3", "carousel-item-title", p.title);
    const h4Desc = createEl("h4", "carousel-item-description", p.desc);
    const h3Price = createEl("h3", "carousel-item-price", p.price);

    item.append(img, h3Title, h4Desc, h3Price);
    track.appendChild(item);
  });

  carousel.append(leftArrow, track, rightArrow);

  const indicators = createEl("div", "carousel-indicators");

  items.forEach((_, i) => {
    const span = createEl("div", `indicator${i == 0 ? " active" : ""}`);
    const fill = createEl("div", "fill");
    span.appendChild(fill);
    indicators.appendChild(span);
  });

  container.append(title, carousel, indicators);
}

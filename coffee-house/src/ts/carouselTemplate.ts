export function renderCarousel(): void {
  const container = document.querySelector(".fav-coffee");
  if (!container) return;

  container.innerHTML = `
    <div class="fav-title">
      <span class="fav-title">Choose your</span>
      <span class="fav-title-light accent">favorite</span>
      <span class="fav-title">coffee</span>
    </div>

    <div class="carousel">
      <button class="carousel-arrow left" aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M18.5 12H6M6 12L12 6M6 12L12 18"
            stroke="#403F3D" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <div class="carousel-track">
        <div class="carousel-item active">
          <img src="./src/img/coffee-slider-1.png" alt="Frappuccino">
          <h3 class="carousel-item-title">S'mores Frappuccino</h3>
          <h4 class="carousel-item-description">
            This new drink takes an espresso and mixes it with brown sugar
            and cinnamon before being topped with oat milk.
          </h4>
          <h3 class="carousel-item-price">$5.50</h3>
        </div>
        <div class="carousel-item">
          <img src="./src/img/coffee-slider-2.png" alt="Caramel Macchiato">
          <h3 class="carousel-item-title">Caramel Macchiato</h3>
          <h4 class="carousel-item-description">
            Fragrant and unique classic espresso with rich caramel-peanut syrup,
            with cream under whipped thick foam.
          </h4>
          <h3 class="carousel-item-price">$5.00</h3>
        </div>
        <div class="carousel-item">
          <img src="./src/img/coffee-slider-3.png" alt="Ice coffee">
          <h3 class="carousel-item-title">Ice coffee</h3>
          <h4 class="carousel-item-description">
            A popular summer drink that tones and invigorates.
            Prepared from coffee, milk and ice.
          </h4>
          <h3 class="carousel-item-price">$4.50</h3>
        </div>
      </div>

      <button class="carousel-arrow right" aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12H18.5M18.5 12L12.5 6M18.5 12L12.5 18"
            stroke="#403F3D" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="carousel-indicators">
      <span class="indicator active"><div class="fill"></div></span>
      <span class="indicator"><div class="fill"></div></span>
      <span class="indicator"><div class="fill"></div></span>
    </div>
  `;
}

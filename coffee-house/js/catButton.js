let allProducts = [];
let currentCategory = "coffee";
// track whether the full product list is currently shown on mobile
let showingAll = false;
const container = document.querySelector(".products");
const btnMore = document.getElementById("btn-more");
const categoryButtons = document.querySelectorAll(".cat-btn");
const modal = document.getElementById("product-modal");
const closeBottomBtn = document.querySelector(".close-bottom-btn");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.add("inactive");
    });
    button.classList.add("active");
    button.classList.remove("inactive");
    const categoryName = button.textContent.trim().toLocaleLowerCase();
    handleCategoryChange(categoryName);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  handleCategoryChange(currentCategory);
});

window.addEventListener("resize", () => {
  updateProductView();
});

function handleCategoryChange(category) {
  fetch("./data/products.json")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data.filter(
        (p) => p.category.toLocaleLowerCase() === category
      );
      // reset any "show all" state when switching categories
      showingAll = false;
      updateProductView();
    })
    .catch((error) => console.log("Error loading products: ", error));
}

function renderProductList(products) {
  container.innerHTML = products
    .map(
      (p) => `
    <div class="product">
      <div class="image-wrapper">
        <img src="./img/${p.image}" alt="${p.name}">
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
  const newList = document.querySelectorAll(".product");
  newList.forEach((p) => {
    p.addEventListener("click", () => {
      handleModalDisplay(p);
    });
  });
}

function displayProducts(products) {
  allProducts = products;
  updateProductView();
}

function updateProductView() {
  container.innerHTML = "";
  btnMore.style.display = "none";
  const isMobile = screen.width <= 768;
  // If on mobile and we have more than 4 products, show only first 4
  // unless the user has already clicked "More" (showingAll === true)
  if (isMobile && allProducts.length > 4) {
    renderProductList(allProducts.slice(0, 4));
    btnMore.style.display = "flex";
    btnMore.onclick = () => {
      showingAll = true;
      renderProductList(allProducts);
      btnMore.style.display = "none";
    };
  } else {
    // either desktop or user asked to show all
    renderProductList(allProducts);
    btnMore.style.display = "none";
  }
}

const closeModal = () => {
  modal.querySelector(".size-small").classList.add("active");
  modal.querySelector(".size-medium").classList.remove("active");
  modal.querySelector(".size-large").classList.remove("active");
  modal.querySelectorAll(".additive").forEach((additive) => {
    additive.classList.remove("active");
  });
  document.body.style.overflow = "";
  modal.style.display = "none";
};
closeBottomBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function handleModalDisplay(product) {
  document.body.style.overflow = "hidden";
  const p = allProducts.find(
    (p) => p.name === product.querySelector(".title").textContent
  );
  modal.style.display = "flex";
  modal.querySelector(".modal-title").textContent = p.name;
  modal.querySelector(".modal-description").textContent = p.description;
  modal.querySelector("size-small").textContent = p.sizes.s.size;
  modal.querySelector("size-medium").textContent = p.sizes.m.size;
  modal.querySelector("size-large").textContent = p.sizes.l.size;
  modal.querySelector(
    ".add-1"
  ).innerHTML = `<span>1</span> ${p.additives[0].name}`;
  modal.querySelector(
    ".add-2"
  ).innerHTML = `<span>2</span> ${p.additives[1].name}`;
  modal.querySelector(
    ".add-3"
  ).innerHTML = `<span>3</span> ${p.additives[2].name}`;
  modal.querySelector(".total strong").innerHTML = `$${p.price}`;
  modal.querySelector("img").src = `./img/${p.image}`;
  modal.querySelector("img").alt = p.name;
}

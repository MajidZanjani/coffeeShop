const sizes = document.querySelectorAll(".size");
const additives = document.querySelectorAll(".additive");

async function getProduct() {
  const productName = document.querySelector(".modal-title").innerHTML;
  try {
    const response = await fetch("./data/products.json");
    const data = await response.json();
    const p = data.find((p) => p.name === productName);
    return p;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

async function calculateTotal() {
  let totalPrice = 0;
  let additivePrice = 0;
  let sizePrice = 0;

  const size = document
    .querySelector(".size.active")
    .classList.contains("size-small")
    ? "s"
    : document.querySelector(".size.active").classList.contains("size-medium")
    ? "m"
    : "l";
  const additives = Array.from(
    document.querySelectorAll(".additive.active")
  ).map((btn) => btn.innerText.replace(/^\d+\s*/, ""));

  const product = await getProduct();

  additives.forEach((name) => {
    product.additives.forEach((add) => {
      if (add.name === name) {
        additivePrice += Number(add["add-price"]);
      }
    });
  });

  if (size != "s") {
    sizePrice = Number(product.sizes[size]["add-price"]);
  }
  totalPrice = Number(product.price) + sizePrice + additivePrice;

  document.querySelector(".total strong").innerHTML = `$${totalPrice.toFixed(
    2
  )}`;
}

sizes.forEach((size) => {
  size.addEventListener("click", () => {
    sizes.forEach((s) => {
      s.classList.remove("active");
    });
    size.classList.add("active");
    calculateTotal();
  });
});

additives.forEach((additive) => {
  additive.addEventListener("click", () => {
    if (additive.classList.contains("active")) {
      additive.classList.remove("active");
    } else {
      additive.classList.add("active");
    }
    calculateTotal();
  });
});

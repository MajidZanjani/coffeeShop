const modal = document.getElementById("productModal");
const closeBottomBtn = document.querySelector(".close-bottom-btn");
const products = document.querySelectorAll(".product");

products.forEach((product) => {
  product.addEventListener("click", () => {
    modal.style.display = "flex";
  });
});

const closeModal = () => {
  modal.style.display = "none";
};

// Close modal when clicking on clode button
closeBottomBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

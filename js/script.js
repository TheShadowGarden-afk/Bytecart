// script.js — ByteCart logic

// ----------------------
// CONFIG
// ----------------------
const AMAZON_TAG = "yourtag-21"; // 🔹 Replace with your Amazon affiliate tag
const CAROUSEL_IMAGES = [
  "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/71LZcGvYwaL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/81x4Yq1Jm-L._SL1500_.jpg"
];

// ----------------------
// CATEGORY NAV
// ----------------------
function buildCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  const nav = document.getElementById("categoryNav");
  nav.innerHTML = cats.map(c => `<div class="category-pill" data-cat="${c}">${c}</div>`).join("");
  nav.addEventListener("click", e => {
    if (e.target.classList.contains("category-pill")) {
      const cat = e.target.dataset.cat;
      renderProducts(cat);
    }
  });
}

// ----------------------
// HERO CAROUSEL
// ----------------------
function buildCarousel() {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = CAROUSEL_IMAGES.map(img => `<img src="${img}" alt="">`).join("");
  let index = 0;
  setInterval(() => {
    index = (index + 1) % CAROUSEL_IMAGES.length;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }, 3500);
}

// ----------------------
// PRODUCT GRID
// ----------------------
function renderProducts(category = null) {
  const grid = document.getElementById("featuredGrid");
  let list = category ? products.filter(p => p.category === category) : products.slice(0, 8);
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}">
      <p class="p-title">${p.title}</p>
      <p class="p-price">${p.price}</p>
      <div class="buy-row">
        <a href="https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}" target="_blank" class="buy-btn">Buy on Amazon</a>
        <a href="#" class="buy-btn secondary" onclick="openProduct('${p.id}')">Details</a>
      </div>
    </div>
  `).join("");
}

// ----------------------
// MODAL (details popup)
// ----------------------
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="card">
      <h2>${p.title}</h2>
      <img src="${p.img}" style="width:100%;max-height:400px;object-fit:contain">
      <p>${p.desc}</p>
      <p class="p-price">${p.price}</p>
      <a href="https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}" target="_blank" class="buy-btn">Buy Now</a>
      <br><br>
      <button class="buy-btn secondary" onclick="this.closest('.modal').remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// ----------------------
// SEARCH BAR
// ----------------------
function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();
    const list = products.filter(p => p.title.toLowerCase().includes(term));
    const grid = document.getElementById("featuredGrid");
    grid.innerHTML = list.map(p => `
      <div class="product-card">
        <img src="${p.img}" alt="${p.title}">
        <p class="p-title">${p.title}</p>
        <p class="p-price">${p.price}</p>
        <div class="buy-row">
          <a href="https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}" target="_blank" class="buy-btn">Buy on Amazon</a>
          <a href="#" class="buy-btn secondary" onclick="openProduct('${p.id}')">Details</a>
        </div>
      </div>
    `).join("");
  });
}

// ----------------------
// THEME TOGGLE
// ----------------------
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// ----------------------
// INIT
// ----------------------
window.addEventListener("DOMContentLoaded", () => {
  buildCarousel();
  buildCategories();
  renderProducts();
  setupSearch();
  setupThemeToggle();
});

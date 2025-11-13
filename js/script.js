// script.js — ByteCart UI
const AMAZON_TAG = "yourtag-21"; // <-- REPLACE with your affiliate tag when ready
const CAROUSEL_IMAGES = [
  "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/71LZcGvYwaL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/81x4Yq1Jm-L._SL1500_.jpg"
];

// Build category navigation from products.js
function buildCategories() {
  if (!window.products) return;
  const cats = [...new Set(products.map(p => p.category))];
  const nav = document.getElementById("categoryNav");
  nav.innerHTML = cats.map(c => `<div class="category-pill" data-cat="${c}">${c.replace(/-/g,' ')}</div>`).join("");
  nav.addEventListener("click", e => {
    if (e.target.classList.contains("category-pill")) renderProducts(e.target.dataset.cat);
  });
}

// Carousel
function buildCarousel() {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = CAROUSEL_IMAGES.map(src => `<img src="${src}" alt="">`).join("");
  let index = 0;
  setInterval(() => {
    index = (index + 1) % CAROUSEL_IMAGES.length;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }, 3500);
}

// Render featured grid
function renderProducts(category = null) {
  const grid = document.getElementById("featuredGrid");
  if (!grid || !window.products) return;
  let list = category ? products.filter(p => p.category === category) : products.slice(0, 12);
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}">
      <p class="p-title">${p.title}</p>
      <p class="p-price">${p.price}</p>
      <div class="buy-row">
        <a href="${p.affiliateLink && p.affiliateLink !== '#AFF_LINK#' ? p.affiliateLink : 'https://www.amazon.in/s?k=' + encodeURIComponent(p.title) + '&tag=' + AMAZON_TAG}" target="_blank" class="buy-btn">Buy on Amazon</a>
        <a href="#" class="buy-btn secondary" onclick="openProduct('${p.id}')">Details</a>
      </div>
    </div>
  `).join("");
  renderCategoryCards();
}

// category cards section
function renderCategoryCards(){
  const el = document.getElementById('categoryCards');
  if(!el || !window.products) return;
  const cats = [...new Set(products.map(p=>p.category))].slice(0,12);
  el.innerHTML = cats.map(c=>`<div class="cat-card"><h4>${c.replace(/-/g,' ')}</h4><p>${products.filter(p=>p.category===c).length} products</p><a href="#" onclick="renderProducts('${c}');window.scrollTo(0,400);return false" class="buy-btn secondary">View</a></div>`).join('');
}

// modal
function openProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const modal = document.createElement('div');
  modal.className='modal';
  modal.innerHTML = `<div class="card">
    <div style="display:flex;gap:16px;align-items:flex-start">
      <img src="${p.img}" style="max-width:320px;max-height:320px;object-fit:contain"/>
      <div style="flex:1">
        <h2>${p.title}</h2>
        <p style="color:var(--muted)">${p.desc}</p>
        <p style="font-weight:700">${p.price}</p>
        <p><a class="buy-btn" href="${p.affiliateLink && p.affiliateLink !== '#AFF_LINK#' ? p.affiliateLink : 'https://www.amazon.in/s?k=' + encodeURIComponent(p.title) + '&tag=' + AMAZON_TAG}" target="_blank">Buy on Amazon</a></p>
      </div>
    </div>
    <p style="text-align:right;margin-top:12px"><button class="buy-btn secondary" onclick="this.closest('.modal').remove()">Close</button></p>
  </div>`;
  document.body.appendChild(modal);
}

// search
function setupSearch(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', ()=> {
    const term = input.value.trim().toLowerCase();
    const list = products.filter(p=>p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
    const grid = document.getElementById('featuredGrid');
    grid.innerHTML = list.length ? list.map(p=>`
      <div class="product-card">
        <img src="${p.img}" alt="${p.title}">
        <p class="p-title">${p.title}</p>
        <p class="p-price">${p.price}</p>
        <div class="buy-row">
          <a href="${p.affiliateLink && p.affiliateLink !== '#AFF_LINK#' ? p.affiliateLink : 'https://www.amazon.in/s?k=' + encodeURIComponent(p.title) + '&tag=' + AMAZON_TAG}" target="_blank" class="buy-btn">Buy on Amazon</a>
          <a href="#" class="buy-btn secondary" onclick="openProduct('${p.id}')">Details</a>
        </div>
      </div>`).join('') : '<p style="padding:20px;color:var(--muted)">No products found</p>';
  });
}

// theme toggle
function setupThemeToggle(){
  const btn = document.getElementById('themeToggle');
  btn && btn.addEventListener('click', ()=> document.body.classList.toggle('dark'));
}

// init
window.addEventListener('DOMContentLoaded', ()=>{
  buildCarousel();
  buildCategories();
  renderProducts();
  setupSearch();
  setupThemeToggle();
});

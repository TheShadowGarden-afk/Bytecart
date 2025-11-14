// js/script.js — upgraded ByteCart logic (uses products.js)
const AMAZON_TAG = "theshadowgard-21"; // your affiliate tag

// helper
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// build category nav
function buildCategories() {
  if (typeof products === 'undefined') return;
  const cats = Array.from(new Set(products.map(p => p.category)));
  const nav = document.getElementById('categoryNav');
  nav.innerHTML = cats.map(c => `<div class="category-pill" data-cat="${c}">${c.replace(/-/g,' ')}</div>`).join('');
  nav.addEventListener('click', e => {
    if (e.target.classList.contains('category-pill')) {
      const cat = e.target.dataset.cat;
      renderProducts(cat);
      window.scrollTo({top: 420, behavior:'smooth'});
    }
  });
}

// carousel
const CAROUSEL_IMAGES = [
  "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/71LZcGvYwaL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/81x4Yq1Jm-L._SL1500_.jpg"
];
function buildCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  carousel.innerHTML = CAROUSEL_IMAGES.map(src => `<img src="${src}" alt="">`).join('');
  let idx=0;
  setInterval(()=> {
    idx = (idx+1) % CAROUSEL_IMAGES.length;
    carousel.style.transform = `translateX(-${idx*100}%)`;
  },3500);
}

// render products into featured grid (shows top N or filter by category)
function renderProducts(category=null, max=12) {
  const grid = document.getElementById('featuredGrid');
  if (!grid || typeof products === 'undefined') return;
  let list = products.slice();
  if (category) list = list.filter(p => p.category === category);
  // show first max items
  list = list.slice(0, max);
  grid.innerHTML = list.map(p => productCardHtml(p)).join('');
  renderCategoryCards(); // update category cards counts
}

function productCardHtml(p) {
  const url = p.affiliateLink && p.affiliateLink !== '#AFF_LINK#'
    ? p.affiliateLink
    : `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}`;
  return `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.img}" alt="${escapeHtml(p.title)}">
      <p class="p-title">${escapeHtml(p.title)}</p>
      <p class="p-desc">${escapeHtml(p.desc)}</p>
      <p class="p-price">${escapeHtml(p.price)}</p>
      <div class="buy-row">
        <a class="buy-btn" href="${url}" target="_blank" rel="noopener">Buy on Amazon</a>
        <a class="buy-btn secondary" href="/products/${slugify(p.title)}.html">Details</a>
      </div>
    </div>
  `;
}

// render category cards
function renderCategoryCards(){
  const el = document.getElementById('categoryCards');
  if(!el) return;
  const cats = Array.from(new Set(products.map(p=>p.category)));
  el.innerHTML = cats.map(c => {
    const count = products.filter(p=>p.category===c).length;
    return `<div class="cat-card"><h4>${c.replace(/-/g,' ')}</h4><p>${count} products</p><a href="#" onclick="renderProducts('${c}');window.scrollTo(420,420);return false" class="buy-btn secondary">View</a></div>`;
  }).join('');
}

// search implementation
function setupSearch(){
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', ()=> {
    const q = input.value.trim().toLowerCase();
    const grid = document.getElementById('featuredGrid');
    if (!q) { renderProducts(); return; }
    const filtered = products.filter(p => (p.title + " " + p.desc).toLowerCase().includes(q));
    grid.innerHTML = filtered.length ? filtered.map(p=>productCardHtml(p)).join('') : '<p style="padding:20px;color:#999">No products found</p>';
  });
}

// utility
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

// init
window.addEventListener('DOMContentLoaded', ()=>{
  buildCarousel();
  buildCategories();
  renderProducts();
  renderCategoryCards();
  setupSearch();
});


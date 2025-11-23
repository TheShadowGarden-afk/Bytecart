// js/script.js — ByteCart UI script
const AMAZON_TAG = "theshadowgard-21"; // your affiliate tag

// small helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

// build category nav
function buildCategories(){
  if (!window.products) return;
  const cats = Array.from(new Set(window.products.map(p=>p.category)));
  const nav = document.getElementById('categoryNav');
  if(!nav) return;
  nav.innerHTML = cats.map(c=>`<div class="category-pill" data-cat="${c}">${c.replace(/-/g,' ')}</div>`).join('');
  nav.addEventListener('click', e=>{
    if(e.target.classList.contains('category-pill')){
      const cat = e.target.dataset.cat;
      renderProducts(cat, 18);
      window.scrollTo({top:420,behavior:'smooth'});
    }
  });
}

// carousel
const CAROUSEL_IMAGES = [
  "https://m.media-amazon.com/images/I/61VfL-aiToL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/71LZcGvYwaL._SL1500_.jpg",
  "https://m.media-amazon.com/images/I/81x4Yq1Jm-L._SL1500_.jpg"
];
function buildCarousel(){
  const c = document.getElementById('carousel');
  if(!c) return;
  c.innerHTML = CAROUSEL_IMAGES.map(src=>`<img src="${src}" alt="">`).join('');
  let idx=0;
  setInterval(()=>{ idx=(idx+1)%CAROUSEL_IMAGES.length; c.style.transform=`translateX(-${idx*100}%)`; },3500);
}

// product card HTML
function productCardHtml(p){
  const url = p.affiliateLink && p.affiliateLink !== '#AFF_LINK#'
    ? p.affiliateLink
    : `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}`;
  return `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">
      <p class="p-title">${escapeHtml(p.title)}</p>
      <p class="p-desc">${escapeHtml(p.desc)}</p>
      <p class="p-price">${escapeHtml(p.price)}</p>
      <div class="buy-row">
        <a class="buy-btn" href="${url}" target="_blank" rel="noopener">Buy on Amazon</a>
        <button class="buy-btn secondary" onclick="openProductModal('${p.id}')">Details</button>
      </div>
    </div>
  `;
}

// render products (category optional)
function renderProducts(category=null, max=12){
  const grid = document.getElementById('featuredGrid');
  if(!grid || !window.products) return;
  let list = window.products.slice();
  if(category) list = list.filter(p=>p.category===category);
  grid.innerHTML = list.slice(0,max).map(p=>productCardHtml(p)).join('');
  renderCategoryCards();
}

// category cards list
function renderCategoryCards(){
  const el = document.getElementById('categoryCards');
  if(!el || !window.products) return;
  const cats = Array.from(new Set(window.products.map(p=>p.category)));
  el.innerHTML = cats.map(c=>{
    const n = window.products.filter(p=>p.category===c).length;
    return `<div class="cat-card"><h4>${c.replace(/-/g,' ')}</h4><p>${n} products</p><a href="#" class="buy-btn secondary" onclick="renderProducts('${c}', 24);window.scrollTo({top:420,behavior:'smooth'});return false">View</a></div>`;
  }).join('');
}

// modal details
function openProductModal(id){
  const p = window.products.find(x=>x.id===id);
  if(!p) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  const url = p.affiliateLink && p.affiliateLink !== '#AFF_LINK#'
    ? p.affiliateLink
    : `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON_TAG}`;
  modal.innerHTML = `
    <div class="card">
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <img src="${p.img}" style="max-width:360px;object-fit:contain"/>
        <div style="flex:1">
          <h2>${escapeHtml(p.title)}</h2>
          <p style="color:var(--muted)">${escapeHtml(p.desc)}</p>
          <p class="p-price">${escapeHtml(p.price)}</p>
          <p><a class="buy-btn" href="${url}" target="_blank" rel="noopener">Buy on Amazon</a></p>
        </div>
      </div>
      <p style="text-align:right;margin-top:12px"><button class="buy-btn secondary" onclick="this.closest('.modal').remove()">Close</button></p>
    </div>
  `;
  document.body.appendChild(modal);
}

// search
function setupSearch(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ renderProducts(null, 12); return; }
    const filtered = window.products.filter(p => (p.title + " " + p.desc).toLowerCase().includes(q));
    const grid = document.getElementById('featuredGrid');
    grid.innerHTML = filtered.length ? filtered.map(p=>productCardHtml(p)).join('') : '<p style="padding:20px;color:var(--muted)">No products found</p>';
  });
}

// theme toggle (simple)
function setupThemeToggle(){
  const btn = document.getElementById('themeToggle');
  btn && btn.addEventListener('click', ()=> document.body.classList.toggle('dark'));
}

// init
window.addEventListener('DOMContentLoaded', ()=>{
  buildCarousel();
  buildCategories();
  renderProducts();
  renderCategoryCards();
  setupSearch();
  setupThemeToggle();
});

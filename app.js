/* ══════════════════════════════════════════════
   AMAGARA LEATHER COMPANY LTD
   ══════════════════════════════════════════════ */

const WHATSAPP = '256756677985'; 

const products = [
  { id:'belt-heritage', name:'Heritage Belt',    cat:'belts',   catLabel:'Belts',   price:5, tag:'Bestseller', img:'images/belt-heritage.jpg' },
  { id:'belt-slim',     name:'Slim Everyday Belt', cat:'belts', catLabel:'Belts',   price:3, tag:'',           img:'images/belt-slim.jpg' },
  { id:'belt-wide',     name:'Wide Waist Belt',  cat:'belts',   catLabel:'Belts',   price:8, tag:'New',        img:'images/belt-wide.jpg' },
  { id:'belt-classic',  name:'Classic Dress Belt', cat:'belts', catLabel:'Belts',   price:2, tag:'',           img:'images/belt-classic.jpg' },
  { id:'belt-casual',   name:'Casual Leather Belt', cat:'belts', catLabel:'Belts',  price:6, tag:'',           img:'images/belt-casual.jpg' },
  { id:'belt-formal',   name:'Formal Black Belt', cat:'belts',  catLabel:'Belts',   price:9, tag:'',           img:'images/belt-formal.jpg' },
  { id:'belt-vintage',  name:'Vintage Tan Belt', cat:'belts',   catLabel:'Belts',   price:4, tag:'',           img:'images/belt-vintage.jpg' },
  { id:'belt-dress',    name:'Dress Leather Belt', cat:'belts', catLabel:'Belts',   price:7, tag:'',           img:'images/belt-dress.jpg' },

  { id:'bag-satchel',   name:'The Satchel',      cat:'bags',    catLabel:'Bags',    price:9, tag:'Bestseller', img:'images/bag-satchel.jpg' },
  { id:'bag-holdall',   name:'Weekend Holdall',  cat:'bags',    catLabel:'Bags',    price:7, tag:'',           img:'images/bag-holdall.jpg' },
  { id:'bag-pouch',     name:'Crossbody Pouch',  cat:'bags',    catLabel:'Bags',    price:5, tag:'New',        img:'images/bag-pouch.jpg' },
  { id:'bag-tote',      name:'Leather Tote',     cat:'bags',    catLabel:'Bags',    price:8, tag:'',           img:'images/bag-tote.jpg' },
  { id:'bag-messenger', name:'Messenger Bag',    cat:'bags',    catLabel:'Bags',    price:6, tag:'',           img:'images/bag-messenger.jpg' },
  { id:'bag-weekender', name:'Weekender Bag',    cat:'bags',    catLabel:'Bags',    price:4, tag:'',           img:'images/bag-weekender.jpg' }
];

const $ = (s, r = document) => r.querySelector(s);
const grid        = $('#productGrid');
const filters     = $('#filters');
const cartBtn     = $('#cartBtn');
const cartCount   = $('#cartCount');
const cartDrawer  = $('#cartDrawer');
const cartItems   = $('#cartItems');
const cartTotal   = $('#cartTotal');
const overlay     = $('#overlay');
const toastEl     = $('#toast');
const nav         = $('#nav');
const menuBtn     = $('#menuBtn');
const navOverlay  = $('#navOverlay');

const modal          = $('#productModal');
const modalBackdrop  = $('#modalBackdrop');
const modalClose     = $('#modalClose');
const modalImg       = $('#modalImg');
const modalCat       = $('#modalCat');
const modalTitle     = $('#modalTitle');
const modalPrice     = $('#modalPrice');
const modalAddBtn    = $('#modalAddBtn');
let currentModalId   = null;

const money = n => n + ' UGX';

function placeholder(name){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#050505"/>
    </linearGradient></defs>
    <rect width="600" height="750" fill="url(#g)"/>
    <rect x="24" y="24" width="552" height="702" fill="none" stroke="#e08e55" stroke-opacity=".3"/>
    <text x="300" y="380" font-family="Georgia,serif" font-size="36" fill="#e08e55"
      text-anchor="middle" letter-spacing="4">${String(name).toUpperCase()}</text>
    <text x="300" y="430" font-family="Helvetica,sans-serif" font-size="14"
      fill="#a3a3a3" text-anchor="middle" letter-spacing="4">AMAGARA</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function attachFallbacks(root){
  root.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      img.src = placeholder(img.dataset.fallback || img.alt || 'Amagara');
    }, { once: true });
    if (img.complete && img.naturalWidth === 0) {
      img.src = placeholder(img.dataset.fallback || img.alt || 'Amagara');
    }
  });
}

let toastTimer;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

let activeFilter = 'all';

function renderProducts(){
  const list = activeFilter === 'all'
    ? products
    : products.filter(p => p.cat === activeFilter);

  grid.innerHTML = list.map((p, index) => `
    <article class="card reveal" style="transition-delay: ${index * 60}ms;" data-id="${p.id}">
      <div class="card-media" data-view="${p.id}">
        <img src="${p.img}" alt="${p.name}" loading="lazy" data-fallback="${p.name}">
        ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-meta">
          <span>${p.catLabel}</span>
          <span class="price">${money(p.price)}</span>
        </div>
        <button class="card-add" data-add="${p.id}">Add to bag</button>
      </div>
    </article>
  `).join('');

  attachFallbacks(grid);
  observeReveals();
}

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  currentModalId = id;
  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalCat.textContent = p.catLabel;
  modalTitle.textContent = p.name;
  modalPrice.textContent = money(p.price);
  
  modal.classList.add('open');
  document.body.classList.add('lock');
}

function closeModal() {
  modal.classList.remove('open');
  if(!cartDrawer.classList.contains('open')) {
    document.body.classList.remove('lock');
  }
  currentModalId = null;
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

modalAddBtn.addEventListener('click', () => {
  if(currentModalId) {
    addToCart(currentModalId);
    closeModal();
    openCart();
  }
});

filters.addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  filters.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  
  document.querySelectorAll('.card').forEach(c => c.classList.remove('in'));
  setTimeout(renderProducts, 50);
});

let cart = {};
try { cart = JSON.parse(localStorage.getItem('amagara_cart')) || {}; } catch { cart = {}; }

function saveCart(){
  try { localStorage.setItem('amagara_cart', JSON.stringify(cart)); } catch {}
}

function cartEntries(){
  return Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => ({ product: products.find(p => p.id === id), qty: q }))
    .filter(e => e.product);
}

function cartTotalValue(){
  return cartEntries().reduce((s, e) => s + e.product.price * e.qty, 0);
}

function bumpCount(){
  const n = cartEntries().reduce((s, e) => s + e.qty, 0);
  cartCount.textContent = n;
  cartCount.classList.remove('pop');
  void cartCount.offsetWidth;
  cartCount.classList.add('pop');
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  bumpCount();
  renderCart();
  const p = products.find(x => x.id === id);
  toast(`${p.name} added to bag`);
}

function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  bumpCount();
  renderCart();
}

function removeItem(id){
  delete cart[id];
  saveCart();
  bumpCount();
  renderCart();
}

function renderCart(){
  const entries = cartEntries();

  if (!entries.length){
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p>Your bag is empty.</p>
        <button class="btn btn-solid" data-shop>Browse Collection</button>
      </div>`;
    cartTotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = entries.map(({ product: p, qty }) => `
    <div class="cart-item">
      <img src="${p.img}" alt="${p.name}" data-fallback="${p.name}">
      <div class="ci-info">
        <h4>${p.name}</h4>
        <span class="ci-price">${money(p.price)}</span>
        <div class="qty">
          <button data-act="dec" data-id="${p.id}" aria-label="Decrease">−</button>
          <span>${qty}</span>
          <button data-act="inc" data-id="${p.id}" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="ci-remove" data-act="rm" data-id="${p.id}" aria-label="Remove">✕</button>
    </div>
  `).join('');

  attachFallbacks(cartItems);
  cartTotal.textContent = money(cartTotalValue());
}

cartItems.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (t){
    const { act, id } = t.dataset;
    if (act === 'inc') changeQty(id, 1);
    if (act === 'dec') changeQty(id, -1);
    if (act === 'rm')  removeItem(id);
    return;
  }
  if (e.target.closest('[data-shop]')){
    closeCart();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  }
});

grid.addEventListener('click', e => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    addToCart(addBtn.dataset.add);
    return;
  }
  
  const viewBtn = e.target.closest('[data-view]');
  if (viewBtn) {
    openModal(viewBtn.dataset.view);
  }
});

function openCart(){
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
}

function closeCart(){
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
  if (!modal.classList.contains('open')) {
    document.body.classList.remove('lock');
  }
}

cartBtn.addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#continueShopping').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuBtn.classList.toggle('open');
  navOverlay.classList.toggle('show');
});

navOverlay.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.classList.remove('open');
  navOverlay.classList.remove('show');
});

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.classList.remove('open');
  navOverlay.classList.remove('show');
}));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    closeCart();
    closeModal();
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
    navOverlay.classList.remove('show');
  }
});

$('#checkoutBtn').addEventListener('click', () => {
  const entries = cartEntries();
  if (!entries.length){ toast('Your bag is empty'); return; }

  const lines = entries.map(({ product: p, qty }) =>
    `• ${p.name} × ${qty} — ${money(p.price * qty)}`
  ).join('\n');

  const message =
    `Hello Amagara Leather Company Ltd! I'd like to place an order:\n\n` +
    `${lines}\n\n` +
    `Total: ${money(cartTotalValue())}\n\n` +
    `Name:\nAddress:\n\nThank you!`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
});

$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  toast('Welcome — check your inbox');
  input.value = '';
});

const header = $('#siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting){
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

function observeReveals(){
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

$('#year').textContent = new Date().getFullYear();

renderProducts();
renderCart();
bumpCount();
observeReveals();

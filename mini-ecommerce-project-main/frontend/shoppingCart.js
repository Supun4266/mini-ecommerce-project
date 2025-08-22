// shoppingCart.js
// Simple cart page: reads localStorage 'cart', renders items, updates totals and cart-count.

const q = (sel) => document.querySelector(sel);
const formatPrice = (n) => `$${Number(n || 0).toFixed(2)}`;

const readCart = () => {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
  catch (e) { return []; }
};
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const setCartCount = (count) => {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
};

// Render a single cart row
const createCartRow = (item) => {
  const row = document.createElement("div");
  row.className = "flex items-center gap-4 p-3 bg-white border rounded";

  const img = document.createElement("div");
  img.className = "w-[80px] h-[80px] bg-center bg-cover rounded";
  img.style.backgroundImage = `url("${item.imageUrl || ''}")`;
  row.appendChild(img);

  const info = document.createElement("div");
  info.className = "flex-1";
  info.innerHTML = `<div class="font-medium">${escapeHtml(item.name || 'Untitled')}</div>
                    <div class="text-sm text-slate-500">Price: ${formatPrice(item.price)}</div>`;
  row.appendChild(info);

  const qtyWrap = document.createElement("div");
  qtyWrap.className = "flex items-center gap-2";
  const dec = document.createElement("button");
  dec.textContent = "-";
  dec.className = "px-2 py-1 border rounded";
  const qty = document.createElement("span");
  qty.textContent = item.quantity || 1;
  qty.className = "w-6 text-center";
  const inc = document.createElement("button");
  inc.textContent = "+";
  inc.className = "px-2 py-1 border rounded";
  qtyWrap.appendChild(dec);
  qtyWrap.appendChild(qty);
  qtyWrap.appendChild(inc);
  row.appendChild(qtyWrap);

  const priceWrap = document.createElement("div");
  priceWrap.className = "w-24 text-right";
  priceWrap.textContent = formatPrice((item.price || 0) * (item.quantity || 1));
  row.appendChild(priceWrap);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "ml-4 text-sm text-red-600";
  row.appendChild(removeBtn);

  // handlers
  inc.addEventListener("click", () => {
    updateQuantity(item.productId, (item.quantity || 1) + 1);
  });
  dec.addEventListener("click", () => {
    updateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1));
  });
  removeBtn.addEventListener("click", () => {
    removeItem(item.productId);
  });

  return row;
};

const escapeHtml = (s) => {
  if (!s) return "";
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};

// core operations
const renderCart = () => {
  const cart = readCart();
  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-msg");
  container.innerHTML = "";

  if (!cart || cart.length === 0) {
    emptyMsg.classList.remove("hidden");
    setCartCount(0);
    updateSummary([]);
    return;
  }
  emptyMsg.classList.add("hidden");

  cart.forEach((item) => {
    const row = createCartRow(item);
    container.appendChild(row);
  });

  setCartCount(cart.reduce((s, it) => s + (it.quantity || 0), 0));
  updateSummary(cart);
};

const updateQuantity = (productId, newQty) => {
  const cart = readCart();
  const idx = cart.findIndex((c) => c.productId === productId);
  if (idx === -1) return;
  cart[idx].quantity = newQty;
  saveCart(cart);
  renderCart();
};

const removeItem = (productId) => {
  let cart = readCart();
  cart = cart.filter((c) => c.productId !== productId);
  saveCart(cart);
  renderCart();
};

const updateSummary = (cart) => {
  const subtotal = cart.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0);
  q("#subtotal").textContent = formatPrice(subtotal);
  q("#total").textContent = formatPrice(subtotal); // shipping free
};

// page init
document.addEventListener("DOMContentLoaded", () => {
  // back button -> home
  document.getElementById("back-to-home")?.addEventListener("click", () => location.href = "home.html");

  // checkout (placeholder)
  document.getElementById("checkout-btn")?.addEventListener("click", () => location.href = "checkOut.html");

  renderCart();
});

// productDetails.js
const BASE_URL = "http://localhost:4000"; // update if backend is elsewhere

// helpers
const $ = (s) => document.querySelector(s);
const formatPrice = (n) => {
  const num = Number(n || 0);
  return Number.isFinite(num) ? `$${num.toFixed(2)}` : "$0.00";
};
const getAuthHeaderIfPresent = () => {
  const u = localStorage.getItem("uToken");
  const a = localStorage.getItem("aToken");
  if (u) return { "Content-Type": "application/json", "uToken": u };
  if (a) return { "Content-Type": "application/json", "authorization": `Bearer ${a}` };
  return { "Content-Type": "application/json" };
};

function qs(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

// fetch product by id (matches your controller route)
async function fetchProductById(id) {
  if (!id) throw new Error("No product id provided");
  const headers = getAuthHeaderIfPresent();
  const url = `${BASE_URL}/api/products/get-products/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data && (data.message || data.error) ? (data.message || data.error) : `Failed to fetch product (${res.status})`;
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data || data.success === false) throw new Error(data && data.message ? data.message : "Failed to fetch product");
  return data.product || data;
}

// render helpers
function renderBasicInfo(p) {
  $("#product-title").textContent = p.name || "Product";
  $("#product-description").textContent = p.description || "";
  $("#product-price").textContent = formatPrice(p.price);
  $("#product-stock").textContent = typeof p.stock !== "undefined" ? `Stock: ${p.stock}` : "";
  $("#product-image").src = p.imageUrl || "https://via.placeholder.com/800x600?text=No+Image";
  $("#product-image").alt = p.name || "product image";
  // breadcrumb category if exists
  if (p.category) $("#breadcrumb-category").textContent = p.category;
}

function renderDetailsGrid(p) {
  const grid = $("#product-details-grid");
  grid.innerHTML = "";
  // Only show known keys — avoid dumping everything.
  const details = [];
  if (p.material) details.push(["Material", p.material]);
  if (p.fit) details.push(["Fit", p.fit]);
  if (p.brand) details.push(["Brand", p.brand]);
  if (p.sku) details.push(["SKU", p.sku]);
  // fallback: include price/stock redundantly (optional)
  details.push(["Price", formatPrice(p.price)]);
  if (typeof p.stock !== "undefined") details.push(["Stock", String(p.stock)]);
  if (details.length === 0) {
    grid.innerHTML = `<div class="text-slate-500">No additional details available.</div>`;
    return;
  }
  for (const [k, v] of details) {
    const el = document.createElement("div");
    el.innerHTML = `<div class="text-xs text-blue-500">${k}</div><div class="text-sm">${v}</div>`;
    grid.appendChild(el);
  }
}

function renderReviews(p) {
  const list = $("#reviews-list");
  const noReviews = $("#no-reviews");
  list.innerHTML = "";
  const reviews = Array.isArray(p.reviews) ? p.reviews : [];
  if (!reviews.length) {
    noReviews.style.display = "block";
    return;
  }
  noReviews.style.display = "none";
  for (const r of reviews) {
    const card = document.createElement("div");
    card.className = "bg-gray-50 p-3 rounded";
    const name = r.name || r.userName || "Anonymous";
    const date = r.date ? new Date(r.date).toLocaleDateString() : "";
    const rating = r.rating ? `Rating: ${r.rating}/5` : "";
    card.innerHTML = `<div class="flex justify-between items-center"><div class="font-semibold">${name}</div><div class="text-xs text-slate-500">${date}</div></div>
                      <div class="text-sm mt-2">${r.comment || ""}</div>
                      <div class="text-xs text-yellow-500 mt-2">${rating}</div>`;
    list.appendChild(card);
  }
}

function renderRelated(p) {
  const grid = $("#related-grid");
  grid.innerHTML = "";
  const related = Array.isArray(p.related) ? p.related : [];
  if (!related.length) {
    grid.innerHTML = `<div class="text-slate-500 col-span-3">No related products.</div>`;
    return;
  }
  for (const r of related) {
    const card = document.createElement("a");
    card.href = `ProductDetails.html?id=${encodeURIComponent(r._id || r.id)}`;
    card.className = "block bg-white p-2 rounded shadow-sm";
    card.innerHTML = `
      <div class="w-full h-36 bg-cover bg-center rounded" style="background-image:url('${r.imageUrl || "https://via.placeholder.com/320"}')"></div>
      <div class="mt-2 text-sm font-medium">${r.name || ""}</div>
      <div class="text-sm text-blue-500">${formatPrice(r.price)}</div>
    `;
    grid.appendChild(card);
  }
}

// cart helpers (keeps structure compatible with shoppingCart.js)
function readCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
function updateCartCountUI() {
  const total = readCart().reduce((s, it) => s + (it.quantity || 0), 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = String(total);
}

// Add to cart behavior
function wireAddToCart(product) {
  const addBtn = $("#add-to-cart");
  const qtyEl = $("#product-qty");
  const feedback = $("#product-feedback");

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const qty = Number(qtyEl.value || 1);
    if (!Number.isFinite(qty) || qty <= 0) {
      feedback.textContent = "Please enter a valid quantity.";
      feedback.style.color = "crimson";
      return;
    }

    const cart = readCart();
    const pid = String(product._id || product.id || "");
    const idx = cart.findIndex((c) => c.productId === pid);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + qty;
    } else {
      cart.push({
        productId: pid,
        name: product.name || "",
        price: Number(product.price || 0),
        quantity: qty,
        imageUrl: product.imageUrl || ""
      });
    }
    saveCart(cart);
    updateCartCountUI();
    feedback.textContent = "Added to cart ✓";
    feedback.style.color = "green";
  });
}

// bootstrap
document.addEventListener("DOMContentLoaded", async () => {
  try {
    updateCartCountUI();
    const id = qs("id");
    if (!id) {
      $("#product-root").innerHTML = `<div class="p-6 text-red-600">Missing product id in URL.</div>`;
      return;
    }
    const p = await fetchProductById(id);

    // Render dynamic sections
    renderBasicInfo(p);
    renderDetailsGrid(p);
    renderReviews(p);
    renderRelated(p);

    // wire add-to-cart with product data
    wireAddToCart(p);
  } catch (err) {
    console.error(err);
    $("#product-root").innerHTML = `<div class="p-6 text-red-600">Failed to load product: ${err.message}</div>`;
  }
});

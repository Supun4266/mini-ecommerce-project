// home.js
const BASE_URL = "http://localhost:4000"; // change if backend runs elsewhere

// Helpers
const q = (sel) => document.querySelector(sel);
const qs = (sel) => Array.from(document.querySelectorAll(sel));
const getUserTokenHeader = () => {
  const uToken = localStorage.getItem("uToken");
  const aToken = localStorage.getItem("aToken");
  const headers = { "Content-Type": "application/json" };
  if (uToken) headers["uToken"] = uToken;
  else if (aToken) headers["authorization"] = `Bearer ${aToken}`; // allow admin to view via Authorization
  return headers;
};
const formatPrice = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : `$${Number(n || 0).toFixed(2)}`);

// Cart helpers (stored in localStorage under "cart")
const readCart = () => {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) { return []; }
};
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const addToCart = (product) => {
  const cart = readCart();
  const idx = cart.findIndex((c) => c.productId === product.productId);
  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ productId: product.productId, name: product.name, price: product.price, quantity: 1 });
  }
  saveCart(cart);
  // simple feedback
  alert(`${product.name} added to cart`);
  updateCartCount();
};
const updateCartCount = () => {
  const cart = readCart();
  const total = cart.reduce((s, it) => s + (it.quantity || 0), 0);
  // try to update any element with id 'cart-count'
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
};

// Render functions
const renderProductCard = (p) => {
  const div = document.createElement("div");
  div.className = "flex flex-col gap-3 pb-3";

  const imgWrap = document.createElement("div");
  imgWrap.className = "w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg";
  imgWrap.style.backgroundImage = `url("${p.imageUrl || ''}")`;
  div.appendChild(imgWrap);

  const title = document.createElement("div");
  const nameP = document.createElement("p");
  nameP.className = "text-[#0d141c] text-base font-medium leading-normal";
  nameP.textContent = p.name || "Untitled";
  const priceP = document.createElement("p");
  priceP.className = "text-[#49739c] text-sm font-normal leading-normal";
  priceP.textContent = formatPrice(p.price);

  title.appendChild(nameP);
  title.appendChild(priceP);
  div.appendChild(title);

  const btn = document.createElement("button");
  btn.className = "mt-2 rounded bg-blue-500 text-white py-1 px-3 text-sm";
  btn.textContent = "Add to Cart";
  btn.addEventListener("click", () =>
    addToCart({ productId: String(p._id), name: p.name, price: Number(p.price || 0) })
  );
  div.appendChild(btn);

  return div;
};

const showProducts = (products) => {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  if (!products || products.length === 0) {
    grid.innerHTML = `<p class="p-4">No products found.</p>`;
    return;
  }
  products.forEach((p) => {
    grid.appendChild(renderProductCard(p));
  });
};

// Fetch products
const fetchProducts = async () => {
  try {
    const headers = getUserTokenHeader();
    const res = await fetch(`${BASE_URL}/api/products/get-products`, { headers });
    if (res.status === 401) {
      // not authorized — show message with link to signin
      document.getElementById("product-grid").innerHTML =
        `<div class="p-6 text-center">Please <a href="Signin.html" class="text-blue-600 underline">sign in</a> to view products.</div>`;
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      document.getElementById("product-grid").innerHTML =
        `<div class="p-6 text-center">Failed to load products: ${err.message || res.statusText}</div>`;
      return;
    }
    const data = await res.json();
    // your backend returns: { success: true, productData }
    const products = data.productData || [];
    showProducts(products);
  } catch (error) {
    console.error("fetchProducts error:", error);
    document.getElementById("product-grid").innerHTML =
      `<div class="p-6 text-center">Network error while loading products.</div>`;
  }
};

// init
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  fetchProducts();
});

// page init
document.addEventListener("DOMContentLoaded", () => {
  // navigate to cart
  document.getElementById("cart-button")?.addEventListener("click", () => location.href = "shoppingCart.html");
});

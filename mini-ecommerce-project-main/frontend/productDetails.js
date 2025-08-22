// productDetails.js
const BASE_URL = "http://localhost:4000"; // update if backend is elsewhere

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

function fmtPrice(n) {
  const num = Number(n || 0);
  if (!Number.isFinite(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
}

async function fetchProductById(id) {
  try {
    const headers = getAuthHeaderIfPresent(); // should return appropriate auth headers
    if (!id) throw new Error("No product id provided");

    const url = `${BASE_URL}/api/products/get-products/${encodeURIComponent(id)}`;
    const res = await fetch(url, { headers });

    // unauthorized
    if (res.status === 401) {
      throw new Error("Unauthorized. Please sign in.");
    }

    // try parse JSON (may throw)
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (data && (data.message || (data.error && data.error.message))) || res.statusText || "Failed to fetch product";
      throw new Error(msg);
    }

    // expect { success: true, product }
    if (!data) throw new Error("Empty response from server");
    if (data.success === false) throw new Error(data.message || "Failed to fetch product");

    return data.product || data; // return product object (fallback to raw data)
  } catch (err) {
    console.error("fetchProductById error:", err);
    throw err;
  }
}


function renderProduct(p) {
  const main = document.querySelector("main") || document.getElementById("product-details-root");
  if (!main) return;

  const imageUrl = p.imageUrl || "https://via.placeholder.com/640x480?text=No+Image";

  // build markup using Tailwind classes similar to your HTML
  main.innerHTML = `
    <div class="max-w-3xl mx-auto px-5 pb-12">
      <div class="mb-6">
        <img id="product-image" src="${imageUrl}" alt="${p.name || ""}" class="w-full rounded-lg shadow-sm object-cover" style="max-height:420px; width:100%;">
      </div>

      <h1 id="product-title" class="text-2xl font-semibold mb-2">${p.name || ""}</h1>
      <p id="product-description" class="text-sm text-gray-700 leading-relaxed mb-6">${p.description || ""}</p>

      <div class="mb-4">
        <p class="text-lg font-semibold">Price</p>
        <p id="product-price" class="text-xl mb-4 text-blue-500">${fmtPrice(p.price)}</p>
        <p class="text-sm text-gray-600">Stock: ${typeof p.stock !== "undefined" ? p.stock : "N/A"}</p>
      </div>

      <label class="block font-semibold mb-1">Quantity</label>
      <div>
        <input id="product-qty" type="number" min="1" value="1" class="w-100 px-10 py-2 border border-gray-300 rounded mb-4">
      </div>
      <button id="add-to-cart" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6">
        Add to Cart
      </button>

      <div id="product-feedback" class="text-sm mt-2"></div>
    </div>
  `;

  // Add Add-to-Cart behavior (example: store in localStorage cart array)
  const addBtn = document.getElementById("add-to-cart");
  const qtyEl = document.getElementById("product-qty");
  const feedback = document.getElementById("product-feedback");
  addBtn?.addEventListener("click", () => {
    const qty = Number(qtyEl.value || 1);
    if (!Number.isFinite(qty) || qty <= 0) {
      feedback.textContent = "Please enter a valid quantity.";
      return;
    }

    // simple localStorage cart: [{ id, name, price, qty, imageUrl }]
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find((c) => c.id === (p._id || p.id));
    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({
        id: p._id || p.id,
        name: p.name,
        price: p.price,
        qty,
        imageUrl: p.imageUrl,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    feedback.textContent = "Added to cart ✓";
    // update cart count UI if exists
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
      const total = cart.reduce((s, it) => s + Number(it.qty || 0), 0);
      cartCountEl.textContent = String(total);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const id = qs("id");
    if (!id) {
      document.querySelector("main").innerHTML = "<div class='p-6 text-center text-red-600'>No product id provided.</div>";
      return;
    }
    const product = await fetchProductById(id);
    renderProduct(product);
  } catch (err) {
    const main = document.querySelector("main") || document.body;
    main.innerHTML = `<div class="p-6 text-center text-red-600">Failed to load product. ${err.message}</div>`;
  }
});

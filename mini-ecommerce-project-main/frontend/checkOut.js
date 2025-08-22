// checkout.js
const BASE_URL = "http://localhost:4000"; // adjust if needed

const q = (s) => document.querySelector(s);
const formatPrice = (n) => `$${Number(n || 0).toFixed(2)}`;

function getAuthHeaders() {
  const uToken = localStorage.getItem("uToken");
  const aToken = localStorage.getItem("aToken");
  const headers = { "Content-Type": "application/json" };
  if (uToken) headers["uToken"] = uToken;
  else if (aToken) headers["authorization"] = `Bearer ${aToken}`;
  return headers;
}

// Try to get userId from localStorage or from decoded JWT token
function getUserIdFromStorageOrToken() {
  try {
    // 1) if localStorage.user exists (your app may set this on signin)
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const u = JSON.parse(userJson);
      if (u && (u._id || u.id)) return u._id || u.id;
    }

    // 2) explicit userId key
    const uid = localStorage.getItem("userId");
    if (uid) return uid;

    // 3) decode JWT from uToken or aToken
    const token = localStorage.getItem("uToken") || localStorage.getItem("aToken");
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          // common fields: sub, id, _id, userId
          return payload.sub || payload.id || payload._id || payload.userId || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Render checkout page summary from sessionStorage.checkoutData
function renderCheckoutPage() {
  const raw = sessionStorage.getItem("checkoutData");
  if (!raw) {
    // no checkout data, redirect to cart
    alert("No checkout data found — redirecting to cart.");
    location.href = "shoppingCart.html";
    return;
  }

  const checkout = JSON.parse(raw);
  // Render the items into the summary area of your Checkout.html
  const itemsContainer = q("#order-items-list");
  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    for (const it of checkout.items) {
      const row = document.createElement("div");
      row.className = "flex items-center justify-between py-3 border-b";
      row.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-16 h-16 bg-cover bg-center rounded" style="background-image:url('${it.imageUrl || ""}')"></div>
          <div>
            <div class="font-medium">${it.name}</div>
            <div class="text-sm text-slate-500">Qty: ${it.quantity}</div>
          </div>
        </div>
        <div class="font-semibold">${formatPrice(it.price * it.quantity)}</div>
      `;
      itemsContainer.appendChild(row);
    }
  }

  // populate totals
  const subtotalEl = q("#checkout-subtotal");
  const shippingEl = q("#checkout-shipping");
  const totalEl = q("#checkout-total");
  if (subtotalEl) subtotalEl.textContent = formatPrice(checkout.subtotal);
  if (shippingEl) shippingEl.textContent = checkout.shipping ? formatPrice(checkout.shipping) : "Free";
  if (totalEl) totalEl.textContent = formatPrice(checkout.total);
}

// Place order: POST /api/orders/add-order
async function placeOrder() {
  const raw = sessionStorage.getItem("checkoutData");
  if (!raw) {
    alert("No items to place an order for.");
    return;
  }
  const checkout = JSON.parse(raw);
  const itemsPayload = checkout.items.map(it => ({ productId: it.productId, quantity: it.quantity }));

  // get userId best-effort
  const userId = getUserIdFromStorageOrToken();

  if (!userId) {
    // still attempt, backend will likely reject (authUser middleware)
    console.warn("User id not found locally; request will include no userId in body.");
  }

  const body = {
    userId: userId, // can be null
    items: itemsPayload
  };

  const headers = getAuthHeaders();

  try {
    // disable button
    const btn = q("#continue-to-payment-btn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Placing order...";
    }

    const res = await fetch(`${BASE_URL}/api/orders/add-order`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.message || data.error || `Failed to place order (${res.status})`;
      alert(msg);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Continue to Payment";
      }
      return;
    }

    // success -> clear cart & checkoutData, notify user
    localStorage.removeItem("cart");
    sessionStorage.removeItem("checkoutData");
    // optionally, store order id to show on success page
    const createdOrder = data.order || data;
    alert("Order placed successfully! Order id: " + (createdOrder._id || createdOrder.id || ""));

    // redirect to orders page or home
    location.href = "home.html";
  } catch (err) {
    console.error("placeOrder error:", err);
    alert(err.message || "Network error placing order");
    const btn = q("#continue-to-payment-btn");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Continue to Payment";
    }
  }
}

// wire UI: assume Checkout.html contains:
// <div id="order-items-list"></div>
// <span id="checkout-subtotal"></span> <span id="checkout-shipping"></span> <span id="checkout-total"></span>
// <button id="continue-to-payment-btn">Continue to Payment</button>

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutPage();
  const btn = q("#continue-to-payment-btn");
  btn?.addEventListener("click", (e) => {
    e.preventDefault();
    placeOrder();
  });
});

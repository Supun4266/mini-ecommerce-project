// order.js


async function fetchOrders() {
  try {
    const token = localStorage.getItem("aToken"); // admin token
    if (!token) {
      alert("Not authorized. Please sign in as admin.");
      location.href = "Signin.html";
      return;
    }

    const res = await fetch(`${BASE_URL}/api/orders/get-orders`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // your authAdmin accepts 'authorization' as well
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      document.getElementById("orderTableBody").innerHTML =
        `<tr><td colspan="6" class="px-4 py-3 text-center text-gray-500">${err.message || res.statusText}</td></tr>`;
      return;
    }

    const data = await res.json();
    // expect { success: true, orderData: [...] }
    const orders = data.orderData || [];
    if (!orders.length) {
      document.getElementById("orderTableBody").innerHTML =
        `<tr><td colspan="6" class="px-4 py-3 text-center text-gray-500">No orders found.</td></tr>`;
      return;
    }

    renderOrders(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    document.getElementById("orderTableBody").innerHTML =
      `<tr><td colspan="6" class="px-4 py-3 text-center text-red-500">Failed to load orders</td></tr>`;
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  orders.forEach((order) => {
    // compute a readable customer name
    const customer = (order.user && (order.user.name || order.user.email)) || "N/A";
    const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : "—";
    const total = order.total ?? 0;
    const status = order.status || "Pending";

    const tr = document.createElement("tr");
    tr.className = "border-t";

    // Order ID, customer, date, status, total, action (expand)
    tr.innerHTML = `
      <td class="px-4 py-2">#${order._id}</td>
      <td class="px-4 py-2 text-blue-500">${escapeHtml(customer)}</td>
      <td class="px-4 py-2">${escapeHtml(date)}</td>
      <td class="px-4 py-2">${escapeHtml(status)}</td>
      <td class="px-4 py-2">$${Number(total).toFixed(2)}</td>
      <td class="px-4 py-2 text-blue-500 cursor-pointer expand-order" data-id="${order._id}">View</td>
    `;

    tbody.appendChild(tr);

    // optionally add a hidden detail row showing items (below this row)
    const detailTr = document.createElement("tr");
    detailTr.className = "order-detail-row hidden bg-gray-50";
    const itemsHtml = (order.items || [])
      .map((it) => {
        const pname = it.productId?.name || "Product";
        const pprice = Number(it.price || it.productId?.price || 0).toFixed(2);
        const qty = it.quantity || 0;
        return `<div class="py-1 border-b last:border-b-0">
                  <div class="flex justify-between items-center gap-4">
                    <div class="text-sm">${escapeHtml(pname)} <span class="text-xs text-gray-500">x${qty}</span></div>
                    <div class="text-sm text-gray-700">$${(pprice)}</div>
                  </div>
                </div>`;
      })
      .join("");

    detailTr.innerHTML = `<td colspan="6" class="px-4 py-3">
      <div>
        <div class="text-sm font-medium mb-2">Items</div>
        ${itemsHtml || "<div class='text-sm text-gray-500'>No items</div>"}
      </div>
    </td>`;

    tbody.appendChild(detailTr);
  });

  // attach expand handlers
  document.querySelectorAll(".expand-order").forEach((el) =>
    el.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      // find the detail row after the clicked row (we added it directly after)
      const tr = e.currentTarget.closest("tr");
      const detailTr = tr.nextElementSibling;
      if (!detailTr) return;
      detailTr.classList.toggle("hidden");
    })
  );
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// attach search after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const orderSearch = document.getElementById("orderSearch");
  if (orderSearch) {
    orderSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#orderTableBody tr");
      rows.forEach((row) => {
        // hide detail rows by default when filtering
        if (row.classList.contains("order-detail-row")) {
          row.style.display = "";
          return;
        }
        const show = row.textContent.toLowerCase().includes(searchTerm);
        row.style.display = show ? "" : "none";
        // also hide its following detail row when parent hidden
        const next = row.nextElementSibling;
        if (next && next.classList.contains("order-detail-row")) {
          next.style.display = show ? "" : "none";
        }
      });
    });
  }

  // load orders now
  fetchOrders();
});

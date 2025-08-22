// dashboard.js

// helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// Build Authorization header (preferred)
const buildAuthHeader = (forJson = true) => {
  const a = localStorage.getItem("aToken");
  if (!a) return null;
  const headers = { "Authorization": `Bearer ${a}` };
  if (forJson) headers["Content-Type"] = "application/json";
  return headers;
};

// For GET product list: prefer user token if present, otherwise admin Authorization
const authHeaderForGet = () => {
  const u = localStorage.getItem("uToken");
  const a = localStorage.getItem("aToken");
  if (u) return { "Content-Type": "application/json", "uToken": u };
  if (a) return { "Content-Type": "application/json", "Authorization": `Bearer ${a}` };
  return { "Content-Type": "application/json" };
};

const fmt = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : `$${Number(n || 0).toFixed(2)}`);

async function fetchProducts() {
  try {
    const headers = authHeaderForGet();
    const res = await fetch(`${BASE_URL}/api/products/get-products`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Failed to load products: ${err.message || res.statusText}`);
      return;
    }
    const data = await res.json();
    const products = data.productData || [];
    renderProducts(products);
  } catch (err) {
    console.error("fetchProducts err:", err);
    alert("Network error while loading products.");
  }
}

function renderProducts(products) {
  const tbody = $("#product-table-body");
  tbody.innerHTML = "";
  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-3 text-center">No products found</td></tr>`;
    return;
  }

  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "border-t";

    const imgTd = document.createElement("td");
    imgTd.className = "px-4 py-2";
    imgTd.innerHTML = `<img src="${p.imageUrl || 'https://via.placeholder.com/32'}" class="rounded-full w-8 h-8 object-cover" alt="img">`;

    const nameTd = document.createElement("td");
    nameTd.className = "px-4 py-2";
    nameTd.textContent = p.name || "";

    const catTd = document.createElement("td");
    catTd.className = "px-4 py-2 text-blue-500";
    catTd.textContent = p.category || "-";

    const priceTd = document.createElement("td");
    priceTd.className = "px-4 py-2";
    priceTd.textContent = fmt(Number(p.price || 0));

    const stockTd = document.createElement("td");
    stockTd.className = "px-4 py-2";
    stockTd.textContent = String(p.stock ?? 0);

    const actionsTd = document.createElement("td");
    actionsTd.className = "px-4 py-2";
    actionsTd.innerHTML = `
      <a href="#" data-id="${p._id}" class="text-blue-500 mr-3 edit-link">Edit</a>
      <button data-id="${p._id}" class="delete-btn text-red-500">Delete</button>
    `;

    tr.appendChild(imgTd);
    tr.appendChild(nameTd);
    tr.appendChild(catTd);
    tr.appendChild(priceTd);
    tr.appendChild(stockTd);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });

  // attach delete & edit handlers
  $$(".delete-btn").forEach((btn) => btn.addEventListener("click", onDeleteProduct));
  $$(".edit-link").forEach((a) => a.addEventListener("click", onEditProduct));
}

// Delete handler
async function onDeleteProduct(e) {
  const id = e.currentTarget.getAttribute("data-id");
  if (!id) return;
  if (!confirm("Delete this product?")) return;
  try {
    const headers = buildAuthHeader(true);
    if (!headers) {
      alert("Not signed in as admin. Redirecting to Signin.");
      location.href = "Signin.html";
      return;
    }
    const res = await fetch(`${BASE_URL}/api/products/delete-product/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }
    alert("Product deleted");
    await fetchProducts();
  } catch (err) {
    console.error("delete err:", err);
    alert("Network error during delete");
  }
}

// Edit handler -> navigate to edit page with the id
function onEditProduct(e) {
  e.preventDefault();
  const id = e.currentTarget.getAttribute("data-id");
  if (!id) return;
  location.href = `productEdit.html?id=${encodeURIComponent(id)}`;
}

// Add-product UX
function toggleAddForm(show) {
  const form = $("#add-product-form");
  if (!form) return;
  form.classList.toggle("hidden", !show);
  if (show) {
    $("#ap-name").focus();
  } else {
    // clear fields
    ["ap-name", "ap-price", "ap-stock", "ap-imageUrl", "ap-description", "ap-imageFile"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === "file") el.value = "";
        else el.value = "";
      }
    });
    // hide preview & feedback if present
    const preview = document.getElementById("ap-imagePreview");
    if (preview) {
      preview.src = "";
      preview.classList.add("hidden");
    }
    const fb = document.getElementById("ap-feedback");
    if (fb) fb.textContent = "";
  }
}

async function onSubmitAddProduct(e) {
  e?.preventDefault?.();

  const nameEl = $("#ap-name");
  const descEl = $("#ap-description");
  const priceEl = $("#ap-price");
  const stockEl = $("#ap-stock");
  const fileEl = document.getElementById("ap-imageFile");
  const previewImg = document.getElementById("ap-imagePreview");
  const feedback = document.getElementById("ap-feedback");
  const submitBtn = document.getElementById("ap-submit");

  if (!nameEl || !priceEl || !stockEl || !descEl || !feedback || !submitBtn) {
    alert("Form elements missing from the page.");
    return;
  }

  const name = nameEl.value.trim();
  const description = descEl.value.trim();
  const price = priceEl.value.trim();
  const stock = stockEl.value.trim();
  const file = fileEl && fileEl.files && fileEl.files[0];

  if (!name || price === "" || stock === "") {
    alert("Please provide name, price and stock.");
    return;
  }

  const priceNum = Number(price);
  const stockNum = Number(stock);
  if (!Number.isFinite(priceNum) || priceNum < 0) return alert("Invalid price");
  if (!Number.isFinite(stockNum) || stockNum < 0) return alert("Invalid stock");

  feedback.textContent = "";
  submitBtn.disabled = true;
  const oldBtnText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";

  try {
    const headersAuth = buildAuthHeader(false); // false => don't add JSON Content-Type

    if (!headersAuth) {
      alert("Not signed in as admin. Redirecting to Signin.");
      location.href = "Signin.html";
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", priceNum);
      formData.append("stock", stockNum);
      formData.append("imageUrl", file, file.name);

      // Use admin auth header but do not set Content-Type (browser will set it)
      const headers = { Authorization: headersAuth.Authorization };

      const res = await fetch(`${BASE_URL}/api/products/add-product`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        feedback.textContent = data.message || "Failed to add product";
        console.error("add product (formdata) error", data);
        return;
      }
      feedback.textContent = "Product added";
      toggleAddForm(false);
      await fetchProducts();
    } else {
      // send JSON without file
      const body = { name, description, price: priceNum, stock: stockNum };
      const headers = { Authorization: headersAuth.Authorization, "Content-Type": "application/json" };
      const res = await fetch(`${BASE_URL}/api/products/add-product`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        feedback.textContent = data.message || "Failed to add product";
        console.error("add product (json) error", data);
        return;
      }
      feedback.textContent = "Product added";
      toggleAddForm(false);
      await fetchProducts();
    }
  } catch (err) {
    console.error("add product err:", err);
    feedback.textContent = err.message || "Network error while adding product";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = oldBtnText || "Save Product";
    if (previewImg) {
      previewImg.src = "";
      previewImg.classList.add("hidden");
    }
  }
}

// wire up UI
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  $("#add-product-btn")?.addEventListener("click", () => toggleAddForm(true));
  $("#ap-cancel")?.addEventListener("click", (e) => { e.preventDefault(); toggleAddForm(false); });

  const fileInput = document.getElementById("ap-imageFile");
  const previewImg = document.getElementById("ap-imagePreview");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f && previewImg) {
        previewImg.src = URL.createObjectURL(f);
        previewImg.classList.remove("hidden");
      } else if (previewImg) {
        previewImg.src = "";
        previewImg.classList.add("hidden");
      }
    });
  }

  $("#ap-submit")?.addEventListener("click", onSubmitAddProduct);
});

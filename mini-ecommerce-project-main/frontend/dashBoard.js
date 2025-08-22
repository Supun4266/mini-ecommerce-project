// dashboard.js
// Simple admin product display / add / delete for your dashboard.html
const BASE_URL = "http://localhost:4000"; // change if backend runs elsewhere

// helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const authHeaderForAdmin = () => {
  const a = localStorage.getItem("aToken");
  if (!a) {
    alert("Not signed in as admin. Redirecting to Signin.");
    location.href = "Signin.html";
    return null;
  }
  // default header used for JSON requests. We'll remove Content-Type when sending FormData.
  return { "Content-Type": "application/json", "aToken": a };
};
const authHeaderForGet = () => {
  // GET /get-products expects uToken or authorization. Admin has only aToken -> send as Authorization.
  const u = localStorage.getItem("uToken");
  const a = localStorage.getItem("aToken");
  if (u) return { "Content-Type": "application/json", "uToken": u };
  if (a) return { "Content-Type": "application/json", "authorization": `Bearer ${a}` };
  return { "Content-Type": "application/json" };
};
const fmt = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : `$${Number(n || 0).toFixed(2)}`);

// Render products into the table body
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
    catTd.textContent = p.category || "-"; // if no category in schema show -

    const priceTd = document.createElement("td");
    priceTd.className = "px-4 py-2";
    priceTd.textContent = fmt(Number(p.price || 0));

    const stockTd = document.createElement("td");
    stockTd.className = "px-4 py-2";
    stockTd.textContent = String(p.stock ?? 0);

    const actionsTd = document.createElement("td");
    actionsTd.className = "px-4 py-2";
    // Edit link (optionally implement later) and delete button
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

  // attach delete handlers
  $$(".delete-btn").forEach((btn) => btn.addEventListener("click", onDeleteProduct));
  $$(".edit-link").forEach((a) => a.addEventListener("click", onEditProduct));
}

// Delete handler
async function onDeleteProduct(e) {
  const id = e.currentTarget.getAttribute("data-id");
  if (!id) return;
  if (!confirm("Delete this product?")) return;
  try {
    const headers = authHeaderForAdmin();
    if (!headers) return;
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

// Edit handler placeholder (you can expand)
function onEditProduct(e) {
  e.preventDefault();
  const id = e.currentTarget.getAttribute("data-id");
  alert("Edit not implemented yet. Product id: " + id);
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
  const urlEl = $("#ap-imageUrl");
  const fileEl = document.getElementById("ap-imageFile");
  const previewImg = document.getElementById("ap-imagePreview");
  const feedback = document.getElementById("ap-feedback");
  const submitBtn = document.getElementById("ap-submit");

  if (!nameEl || !priceEl || !stockEl || !descEl || !feedback || !submitBtn) {
    alert("Form elements missing from the page.");
    return;
  }

  const headersFromAuth = authHeaderForAdmin();
  if (!headersFromAuth) return;

  const name = nameEl.value.trim();
  const description = descEl.value.trim();
  const price = priceEl.value.trim();
  const stock = stockEl.value.trim();
  const imageUrlValue = urlEl ? urlEl.value.trim() : "";
  const file = fileEl && fileEl.files && fileEl.files[0];

  // basic client-side checks
  if (!name || price === "" || stock === "") {
    alert("Please provide name, price and stock.");
    return;
  }

  const priceNum = Number(price);
  const stockNum = Number(stock);
  if (!Number.isFinite(priceNum) || priceNum < 0) return alert("Invalid price");
  if (!Number.isFinite(stockNum) || stockNum < 0) return alert("Invalid stock");

  // UI feedback
  feedback.textContent = "";
  submitBtn.disabled = true;
  const oldBtnText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";

  try {
    // Decide whether to send multipart (file present) or JSON
    const useFormData = !!file;

    if (useFormData) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", priceNum);
      formData.append("stock", stockNum);

      // append file under field name "imageUrl" (matches upload.single("imageUrl"))
      formData.append("imageUrl", file, file.name);

      // also append imageUrl text if provided (backend can prefer file over text)
      if (imageUrlValue) formData.append("imageUrlUrl", imageUrlValue);

      // prepare headers but remove Content-Type so browser can set multipart boundary
      const headers = { ...headersFromAuth };
      if (headers["Content-Type"]) delete headers["Content-Type"];

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
      // send JSON (no file). include imageUrl string if provided
      const body = { name, description, price: priceNum, stock: stockNum, imageUrl: imageUrlValue };
      const headers = { ...headersFromAuth }; // contains Content-Type: application/json
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
    // clear preview if any
    if (previewImg) {
      previewImg.src = "";
      previewImg.classList.add("hidden");
    }
  }
}

// wire up UI
document.addEventListener("DOMContentLoaded", () => {
  // fetch products to display
  fetchProducts();

  // add product button toggles the small form
  $("#add-product-btn")?.addEventListener("click", () => toggleAddForm(true));
  $("#ap-cancel")?.addEventListener("click", (e) => { e.preventDefault(); toggleAddForm(false); });

  // file preview handling (if the file input exists on the page)
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

  // wire submit
  $("#ap-submit")?.addEventListener("click", onSubmitAddProduct);
});

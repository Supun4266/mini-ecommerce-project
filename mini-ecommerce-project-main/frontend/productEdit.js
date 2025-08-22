// productEdit.js
const BASE_URL = "http://localhost:4000"; // adjust if needed

const $ = (sel) => document.querySelector(sel);

function qsParam(name) {
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

function buildAuthHeader(forJson = true) {
  const a = localStorage.getItem("aToken");
  if (!a) return null;
  const headers = { "Authorization": `Bearer ${a}` };
  if (forJson) headers["Content-Type"] = "application/json";
  return headers;
}

async function fetchProduct(id) {
  if (!id) throw new Error("No product id provided");
  const headers = buildAuthHeader(true);
  if (!headers) {
    throw new Error("Admin token missing. Please sign in as admin.");
  }
  const res = await fetch(`${BASE_URL}/api/products/get-products/${encodeURIComponent(id)}`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.message || `Failed to fetch product (${res.status})`);
  }
  const data = await res.json();
  if (!data || data.success === false) throw new Error(data.message || "Failed to fetch product");
  return data.product || data;
}

function showFeedback(msg, isError = false) {
  const fb = $("#form-feedback");
  if (!fb) return;
  fb.textContent = msg || "";
  fb.style.color = isError ? "crimson" : "green";
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = qsParam("id");
  if (!id) {
    alert("No product id provided.");
    location.href = "dashBoard.html";
    return;
  }

  const backBtn = $("#back-to-dashboard");
  backBtn?.addEventListener("click", () => location.href = "dashBoard.html");

  const nameEl = $("#p-name");
  const descEl = $("#p-description");
  const priceEl = $("#p-price");
  const stockEl = $("#p-stock");
  const imagePreview = $("#p-image-preview");
  const imageFileInput = $("#p-imageFile");
  const newImagePreview = $("#p-new-image-preview");
  const form = $("#edit-product-form");
  const saveBtn = $("#save-btn");
  const cancelBtn = $("#cancel-btn");

  try {
    const product = await fetchProduct(id);
    $("#product-id").value = product._id || product.id || id;
    nameEl.value = product.name || "";
    descEl.value = product.description || "";
    priceEl.value = product.price ?? "";
    stockEl.value = product.stock ?? "";
    imagePreview.src = product.imageUrl || "https://via.placeholder.com/320x320?text=No+Image";
    imagePreview.dataset.currentUrl = product.imageUrl || "";
  } catch (err) {
    console.error(err);
    alert("Failed to load product: " + (err.message || ""));
    location.href = "dashBoard.html";
    return;
  }

  imageFileInput?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      newImagePreview.src = "";
      newImagePreview.classList.add("hidden");
      return;
    }
    newImagePreview.src = URL.createObjectURL(f);
    newImagePreview.classList.remove("hidden");
  });

  cancelBtn?.addEventListener("click", (ev) => {
    ev.preventDefault();
    location.href = "dashBoard.html";
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    showFeedback("");

    const name = nameEl.value.trim();
    const description = descEl.value.trim();
    const price = priceEl.value;
    const stock = stockEl.value;

    if (!name || price === "" || stock === "") {
      showFeedback("Name, price and stock are required", true);
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("price", Number(price));
    fd.append("stock", Number(stock));

    const file = imageFileInput.files && imageFileInput.files[0];
    if (file) {
      fd.append("imageUrl", file, file.name);
    } else {
      const existing = imagePreview.dataset.currentUrl || "";
      if (existing) fd.append("existingImageUrl", existing);
    }

    const headers = buildAuthHeader(false); // don't set Content-Type for FormData
    if (!headers) {
      alert("Admin token missing. Please sign in as admin.");
      location.href = "Signin.html";
      return;
    }

    try {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";

      const res = await fetch(`${BASE_URL}/api/products/update-product/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Authorization: headers.Authorization }, // only auth header
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showFeedback(data.message || `Failed to update product (${res.status})`, true);
        console.error("update error", data);
        return;
      }

      showFeedback("Product updated successfully");
      setTimeout(() => location.href = "dashBoard.html", 800);
    } catch (err) {
      console.error(err);
      showFeedback(err.message || "Network error while updating product", true);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes";
    }
  });
});

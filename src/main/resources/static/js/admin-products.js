const API_URL = "/admin/products";

const BASE_URL = "http://localhost:8080"; // ✅ FIX ADDED

let allProducts = [];
let filteredProducts = [];
let currentPage = 0;
const pageSize = 5;

/* ================= AUTH ================= */

function getToken() {
  return localStorage.getItem("token");
}

function ensureAdminAccess() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "ADMIN") {
    window.location.replace("/admin-login.html");
    return false;
  }

  return true;
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/* ================= NAVIGATION ================= */

function goBackToAdminHome() {
  window.location.href = "/admin-home.html";
}

/* ================= IMAGE URL FIX ================= */

function fixImageUrl(url) {

  if (!url) {
    return "https://via.placeholder.com/300?text=No+Image";
  }

  /* already full url */
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  /* uploads image */
  if (url.startsWith("/uploads/")) {
    return BASE_URL + url;   // ✅ FIXED
  }

  /* uploads image without slash */
  if (url.startsWith("uploads/")) {
    return BASE_URL + "/" + url;  // ✅ FIXED
  }

  /* fallback case (IMPORTANT FIX) */
  return BASE_URL + "/uploads/" + url;
}

/* ================= IMAGE PREVIEW ================= */

function attachPreviewListeners() {

  const allInputs = document.querySelectorAll(
    "#mainImageFile, .gallery-image-file"
  );

  allInputs.forEach(input => {

    input.removeEventListener(
      "change",
      renderImagePreviews
    );

    input.addEventListener(
      "change",
      renderImagePreviews
    );
  });
}

function renderImagePreviews() {

  const previewGrid =
    document.getElementById("previewGrid");

  if (!previewGrid) return;

  previewGrid.innerHTML = "";

  /* MAIN IMAGE */
  const mainFile =
    document.getElementById("mainImageFile")?.files[0];

  if (mainFile) {
    previewGrid.appendChild(
      createPreviewCard(mainFile, true)
    );
  }

  /* GALLERY */
  document.querySelectorAll(
    ".gallery-image-file"
  ).forEach(input => {

    const file = input.files[0];

    if (file) {
      previewGrid.appendChild(
        createPreviewCard(file, false)
      );
    }
  });
}

function createPreviewCard(file, isPrimary) {

  const card = document.createElement("div");
  card.className = "preview-card";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  card.appendChild(img);

  if (isPrimary) {

    const badge =
      document.createElement("div");

    badge.className = "preview-badge";
    badge.innerText = "MAIN";

    card.appendChild(badge);
  }

  return card;
}

/* ================= IMAGE UPLOAD ================= */

async function uploadImages(files) {

  const formData = new FormData();

  files.forEach(file => {
    formData.append("files", file);
  });

  const response = await fetch("/upload", {
    method: "POST",

    headers: {
      Authorization: "Bearer " + getToken()
    },

    body: formData
  });

  if (!response.ok) {

    const err = await response.text();

    console.error("Upload error:", err);

    throw new Error(
      err || "Image upload failed"
    );
  }

  return await response.json();
}

/* ================= ADD PRODUCT ================= */

async function addProduct(event) {

  event.preventDefault();

  const msg =
    document.getElementById("message");

  try {

    msg.style.color = "#facc15";
    msg.innerText = "Uploading images...";

    const files = [];

    /* MAIN */
    const mainImageFile =
      document.getElementById("mainImageFile")?.files[0];

    if (mainImageFile) {
      files.push(mainImageFile);
    }

    /* GALLERY */
    document.querySelectorAll(
      ".gallery-image-file"
    ).forEach(input => {

      if (input.files[0]) {
        files.push(input.files[0]);
      }
    });

    let uploadedResponse = [];

    if (files.length > 0) {
      uploadedResponse =
        await uploadImages(files);
    }

    const uploadedUrls =
      Array.isArray(uploadedResponse)
        ? uploadedResponse
        : uploadedResponse.urls;

    const images =
      (uploadedUrls || []).map(
        (url, i) => ({
          imageUrl: url,
          primaryImage: i === 0
        })
      );

    const data = {

      name:
        document.getElementById("name").value,

      description:
        document.getElementById("description").value,

      price:
        document.getElementById("price").value,

      stock:
        document.getElementById("stock").value,

      category:
        document.getElementById("category").value,

      imageUrl:
        uploadedUrls?.[0] || "",

      images
    };
	console.log("PRODUCT DATA:", data);

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + getToken()
      },

      body: JSON.stringify(data)
    });

    const result =
      await response.json().catch(() => ({}));

    if (!response.ok) {

      msg.style.color = "#f87171";

      msg.innerText =
        result.message ||
        "Unable to add product";

      return;
    }

    msg.style.color = "#4ade80";

    msg.innerText =
      "✅ Product added successfully!";

    setTimeout(() => {
      window.location.href =
        "/all-products-admin.html";
    }, 1000);

  } catch (err) {

    console.error(err);

    msg.style.color = "#f87171";

    msg.innerText =
      "❌ Server error";
  }
}

/* ================= LOAD PRODUCTS ================= */

async function loadAllProducts() {

  try {

    const response =
      await fetch(API_URL, {

        headers: {
          Authorization:
            "Bearer " + getToken()
        }
      });

    if (
      response.status === 401 ||
      response.status === 403
    ) {

      window.location.replace(
        "/admin-login.html"
      );

      return;
    }

    allProducts =
      await response.json();

    filteredProducts =
      [...allProducts];

    renderProducts();

  } catch (err) {

    console.error(
      "Load products error:",
      err
    );
  }
}

/* ================= SEARCH ================= */

function setupSearch() {

  const input =
    document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", () => {

    const key =
      input.value.toLowerCase().trim();

    if (!key) {

      filteredProducts =
        [...allProducts];

    } else {

      filteredProducts =
        allProducts.filter(p =>

          (p.name || "")
            .toLowerCase()
            .includes(key)

          ||

          (p.id + "")
            .includes(key)

          ||

          (p.category || "")
            .toLowerCase()
            .includes(key)
        );
    }

    currentPage = 0;

    renderProducts();
  });
}

/* ================= RENDER PRODUCTS ================= */

function renderProducts() {

  const container =
    document.getElementById("productList");

  if (!container) return;

  const start =
    currentPage * pageSize;

  const end =
    start + pageSize;

  const pageData =
    filteredProducts.slice(start, end);

  if (!pageData.length) {

    container.innerHTML =
      "<p>No products found</p>";

    return;
  }

  let html = `

    <table class="product-table">

      <tr>
        <th>Image</th>
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Actions</th>
      </tr>
  `;

  pageData.forEach(p => {

    let img = p.imageUrl;

    if (
      p.images &&
      p.images.length > 0
    ) {

      const primary =
        p.images.find(
          i => i.primaryImage
        );

      img =
        primary?.imageUrl ||
        p.images[0].imageUrl;
    }

    img = fixImageUrl(img);

    html += `

      <tr>

        <td>

          <img
            src="${img}"
            class="product-thumb"

            style="
              width:70px;
              height:70px;
              object-fit:cover;
              border-radius:10px;
            "

            onerror="this.src='https://via.placeholder.com/70?text=No+Img'"
          />

        </td>

        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>${p.category}</td>

        <td>

          <a
            class="action-btn view-btn"
            href="/view-product-admin.html?id=${p.id}">

            View

          </a>

          <a
            class="action-btn edit-btn"
            href="/edit-product.html?id=${p.id}">

            Update

          </a>

          <button
            class="action-btn delete-btn"
            onclick="deleteProduct(${p.id})">

            Delete

          </button>

        </td>

      </tr>
    `;
  });

  html += "</table>";

  html += renderPagination();

  container.innerHTML = html;
}

/* ================= PAGINATION ================= */

function renderPagination() {

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      pageSize
    );

  if (totalPages === 0) return "";

  return `

    <div class="pagination">

      <button
        class="page-btn"
        onclick="prevPage()"
        ${currentPage === 0 ? "disabled" : ""}>

        ⬅ Prev

      </button>

      <span class="page-info">

        ${currentPage + 1}
        /
        ${totalPages}

      </span>

      <button
        class="page-btn"
        onclick="nextPage()"
        ${currentPage === totalPages - 1 ? "disabled" : ""}>

        Next ➡

      </button>

    </div>
  `;
}

function nextPage() {

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      pageSize
    );

  if (currentPage < totalPages - 1) {

    currentPage++;

    renderProducts();
  }
}

function prevPage() {

  if (currentPage > 0) {

    currentPage--;

    renderProducts();
  }
}

/* ================= DELETE ================= */

async function deleteProduct(id) {

  if (!confirm("Delete this product?")) return;

  await fetch(`${API_URL}/${id}`, {

    method: "DELETE",

    headers: {
      Authorization:
        "Bearer " + getToken()
    }
  });

  loadAllProducts();
}

/* ================= VIEW PRODUCT ================= */

async function loadProductDetails() {

  const id =
    getProductIdFromUrl();

  if (!id) return;

  const response =
    await fetch(`${API_URL}/${id}`, {

      headers: {
        Authorization:
          "Bearer " + getToken()
      }
    });

  const product =
    await response.json();

  const container =
    document.getElementById("productDetails");

  if (!container) return;

  const images =
    product.images || [];

  container.innerHTML = `

	  <div class="product-view-wrapper">

	    <div class="gallery-section">

	      <div
	        id="thumbnailContainer"
	        class="thumbnail-container">
	      </div>

	      <div class="main-image-container">

	        <img
	          id="mainImage"
	          class="main-image"
	          src=""
	          alt="${product.name}"
	        />

	      </div>

	    </div>

	    <div class="product-info">

	      <h1 class="product-title">
	        ${product.name}
	      </h1>

	      <p class="product-description">
	        ${product.description}
	      </p>

	      <div class="product-price">
	        ₹${product.price}
	      </div>

	      <div class="product-meta">
	        <p><b>Stock:</b> ${product.stock}</p>
	        <p><b>Category:</b> ${product.category}</p>
	      </div>

	    </div>

	  </div>

	`;

  loadProductImages(images);
}

/* ================= IMAGE GALLERY ================= */

function loadProductImages(images) {

  const mainImage =
    document.getElementById("mainImage");

  const thumbnailContainer =
    document.getElementById("thumbnailContainer");

  if (
    !mainImage ||
    !thumbnailContainer
  ) return;

  if (!images.length) {

    mainImage.src =
      "https://via.placeholder.com/500?text=No+Image";

    return;
  }

  const primary =
    images.find(i => i.primaryImage);

  mainImage.src =
    fixImageUrl(
      primary?.imageUrl ||
      images[0].imageUrl
    );

  thumbnailContainer.innerHTML = "";

  images.forEach((img, index) => {

    const thumb =
      document.createElement("img");

    thumb.src =
      fixImageUrl(img.imageUrl);

    thumb.className = "thumbnail";

    thumb.onerror = function () {
      this.src =
         "/images/no-image.png";
    };

    if (index === 0) {
      thumb.classList.add("active");
    }

    thumb.onclick = () => {

      mainImage.src =
        fixImageUrl(img.imageUrl);

      document
        .querySelectorAll(".thumbnail")
        .forEach(t =>
          t.classList.remove("active")
        );

      thumb.classList.add("active");
    };

    thumbnailContainer.appendChild(thumb);
  });
}

/* ================= EDIT PRODUCT ================= */

async function loadEditProduct() {

  const id =
    getProductIdFromUrl();

  if (!id) return;

  const response =
    await fetch(`${API_URL}/${id}`, {

      headers: {
        Authorization:
          "Bearer " + getToken()
      }
    });

  const p =
    await response.json();

  document.getElementById("name").value =
    p.name || "";

  document.getElementById("description").value =
    p.description || "";

  document.getElementById("price").value =
    p.price || "";

  document.getElementById("stock").value =
    p.stock || "";

  document.getElementById("category").value =
    p.category || "";

  document.getElementById("imageUrl").value =
    p.imageUrl || "";
}

/* ================= UPDATE PRODUCT ================= */

async function updateProduct(event) {

  event.preventDefault();

  const id =
    getProductIdFromUrl();

  const msg =
    document.getElementById("message");

  const data = {

    name:
      document.getElementById("name").value,

    description:
      document.getElementById("description").value,

    price:
      document.getElementById("price").value,

    stock:
      document.getElementById("stock").value,

    category:
      document.getElementById("category").value,

    imageUrl:
      document.getElementById("imageUrl").value
  };

  const response =
    await fetch(`${API_URL}/${id}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + getToken()
      },

      body:
        JSON.stringify(data)
    });

  if (!response.ok) {

    msg.style.color = "#ef4444";

    msg.innerText =
      "❌ Failed to update product";

    return;
  }

  msg.style.color = "#22c55e";

  msg.innerText =
    "✅ Product updated successfully";
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  if (!ensureAdminAccess()) return;

  attachPreviewListeners();

  if (document.getElementById("addProductForm")) {
    document.getElementById("addProductForm")
      .addEventListener("submit", addProduct);
  }

  if (document.getElementById("productList")) {
    loadAllProducts();
    setupSearch();
  }

  if (document.getElementById("productDetails")) {
    loadProductDetails();
  }

  if (document.getElementById("editProductForm")) {
    loadEditProduct();
    document.getElementById("editProductForm")
      .addEventListener("submit", updateProduct);
  }
});
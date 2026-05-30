function ensureCustomer() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token || role !== "USER") {
    window.location.replace("/login.html");
    return false;
  }

  const welcome = document.getElementById("welcomeText");
  if (welcome) {
    welcome.innerText = `Welcome, ${username}`;
  }

  return true;
}

function getToken() {
  return localStorage.getItem("token");
}

function startShopping() {
  loadProducts();
}

function goToCart() {
  window.location.href = "/view-cart.html";
}

function goBackToShopping() {
  window.location.href = "/customer-home.html";
}

/* ===============================
   UPDATED PRODUCT LOADER (GRID UI)
================================*/
/* ===============================
   UPDATED PRODUCT LOADER (LUXURY GRID UI + MULTIPLE IMAGES)
================================*/
async function loadProducts() {

  const response = await fetch("/products", {
    headers: {
      "Authorization": "Bearer " + getToken()
    }
  });

  if (response.status === 401) {
    logout();
    return;
  }

  const products = await response.json();

  const shoppingSection =
    document.getElementById("shoppingSection");

  const productList =
    document.getElementById("productList");

  shoppingSection.style.display = "block";

  if (!products.length) {

    productList.innerHTML =
      "<p>No products found</p>";

    return;
  }

  let html = `

    <!-- 🔍 SEARCH + FILTER BAR -->
    <div class="luxury-toolbar">

      <input
        type="text"
        id="productSearch"
        class="luxury-search"
        placeholder="🔍 Search granite, tiles, marble..."
      />

      <select id="categoryFilter" class="luxury-filter">

        <option value="">🪨 All Collections</option>

        <option value="Granite">
          🪨 Granite
        </option>

        <option value="Flooring Tiles">
          🏠 Flooring Tiles
        </option>

        <option value="Parking Tiles">
          🚗 Parking Tiles
        </option>

        <option value="Kitchen Tiles">
          🍽️ Kitchen Tiles
        </option>

        <option value="Bathroom Tiles">
          🚿 Bathroom Tiles
        </option>

        <option value="Pooja Room Tiles">
          🛕 Pooja Room Tiles
        </option>

        <option value="Elevation Tiles">
          🏢 Elevation Tiles
        </option>

        <option value="Border Patti">
          ✨ Border Patti
        </option>

        <option value="Outdoor Tiles">
          🌿 Outdoor Tiles
        </option>

        <option value="Marble Finish">
          💎 Marble Finish
        </option>

        <option value="Glossy">
          🌟 Glossy
        </option>

        <option value="Matte">
          🎨 Matte
        </option>

      </select>

    </div>

    <div class="product-grid">
  `;

  /* ===================================
     PRODUCTS LOOP
  =================================== */

  products.forEach(product => {

    // ✅ MAIN IMAGE
    let mainImage =
      product.imageUrl ||
      "https://via.placeholder.com/300";

    // ✅ MULTIPLE IMAGES SUPPORT
    if (
      product.images &&
      product.images.length > 0
    ) {

      const primary =
        product.images.find(
          img => img.primaryImage
        );

      mainImage =
        primary?.imageUrl ||
        product.images[0].imageUrl;
    }

    // ✅ THUMBNAILS
    let thumbnails = "";

    if (
      product.images &&
      product.images.length > 0
    ) {

      product.images.forEach(img => {

        thumbnails += `
          <img
            src="${img.imageUrl}"
            class="mini-thumb"

            onclick="
              const card =
                this.closest('.product-card');

              const mainImg =
                card.querySelector('.product-img');

              mainImg.src='${img.imageUrl}';
            "
          />
        `;
      });
    }

    html += `

      <div class="product-card luxury-card">

        <!-- IMAGE -->
        <div class="image-wrapper">

          <img
            src="${mainImage}"
            class="product-img"

            onmousemove="
              this.style.transform='scale(1.25)';
            "

            onmouseleave="
              this.style.transform='scale(1)';
            "

            onclick="
              openFullscreenImage(this.src)
            "

            onerror="
              this.src='https://via.placeholder.com/300?text=No+Image'
            "
          />

          <div class="image-overlay">
            Premium Collection
          </div>

        </div>

        <!-- THUMBNAILS -->
        <div class="thumbnail-row">
          ${thumbnails}
        </div>

        <!-- INFO -->
        <div class="product-title">
          ${product.name}
        </div>

        <div class="product-category">
          ${product.category}
        </div>

        <div class="product-price">
          ₹${product.price}
        </div>

        <div class="product-stock">

          ${
            product.stock > 0
              ? "✅ In Stock"
              : "❌ Out of Stock"
          }

        </div>

        <!-- ACTIONS -->
        <div class="product-actions">

          <button
            class="add-btn"
            onclick="addToCart(${product.id})"
          >
            🛒 Add to Cart
          </button>

        </div>

      </div>
    `;
  });

  html += `</div>`;

  productList.innerHTML = html;

  // =====================================
  // 🔍 LIVE SEARCH
  // =====================================

  const searchInput =
    document.getElementById("productSearch");

  const categoryFilter =
    document.getElementById("categoryFilter");

  function applyFilters() {

    const keyword =
      searchInput.value.toLowerCase();

    const category =
      categoryFilter.value.toLowerCase();

    const cards =
      document.querySelectorAll(".product-card");

    cards.forEach(card => {

      const name =
        card.querySelector(".product-title")
            .innerText.toLowerCase();

      const cat =
        card.querySelector(".product-category")
            .innerText.toLowerCase();

      const matchesSearch =
        name.includes(keyword);

      const matchesCategory =
        !category || cat.includes(category);

      card.style.display =
        matchesSearch && matchesCategory
          ? "block"
          : "none";
    });
  }

  searchInput.addEventListener(
    "input",
    applyFilters
  );

  categoryFilter.addEventListener(
    "change",
    applyFilters
  );
}

/* ===============================
   ADD TO CART
================================*/
async function addToCart(productId) {
  const response = await fetch("/customer/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getToken()
    },
    body: JSON.stringify({
      productId: productId,
      quantity: 1
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    alert(result.message || "Failed to add product");
    return;
  }

  alert("Added to cart successfully");
}

/* ===============================
   🔥 UPGRADED CART SYSTEM
================================*/
async function loadCart() {
  const response = await fetch("/customer/cart", {
    headers: {
      "Authorization": "Bearer " + getToken()
    }
  });

  if (response.status === 401) {
    logout();
    return;
  }

  const cart = await response.json();

  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartList) return;

  if (!cart.items.length) {
    cartList.innerHTML = "<p class='empty-state'>Your cart is empty</p>";
    cartTotal.innerText = "";
    return;
  }

  let html = "";

  cart.items.forEach(item => {
    html += `
      <div class="cart-card">

        <img src="${item.imageUrl || ''}"
             class="cart-img"
             onerror="this.src='https://via.placeholder.com/100'" />

        <div class="cart-info">
          <h4>${item.productName}</h4>
          <p>Price: ₹${item.price}</p>
          <p>Subtotal: ₹${item.subtotal}</p>

          <div class="qty-controls">
            <button onclick="changeQty(${item.cartItemId}, ${item.quantity - 1})">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${item.cartItemId}, ${item.quantity + 1})">+</button>
          </div>

          <button class="remove-btn"
            onclick="removeCartItem(${item.cartItemId})">
            Remove
          </button>

        </div>

      </div>
    `;
  });

  cartList.innerHTML = html;
  cartTotal.innerText = `Total: ₹${cart.totalAmount}`;
}

/* ===============================
   UPDATE QUANTITY (+ / -)
================================*/
async function changeQty(cartItemId, quantity) {
  if (quantity < 1) return;

  const response = await fetch(`/customer/cart/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getToken()
    },
    body: JSON.stringify({
      quantity: quantity
    })
  });

  if (!response.ok) {
    alert("Failed to update quantity");
    return;
  }

  loadCart();
}

/* ===============================
   REMOVE ITEM
================================*/
async function removeCartItem(cartItemId) {
  await fetch(`/customer/cart/${cartItemId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + getToken()
    }
  });

  loadCart();
}

/* ===============================
   CHECKOUT (UNCHANGED)
================================*/
async function checkout() {
  try {
    const cartRes = await fetch("/customer/cart", {
      headers: {
        Authorization: "Bearer " + getToken()
      }
    });

    const cart = await cartRes.json();

    // 🔥 SAFETY CHECK (VERY IMPORTANT)
    const items = Array.isArray(cart.items) ? cart.items : [];

    if (items.length === 0) {
      alert("Cart empty");
      return;
    }

    // 🔥 DEBUG (check what you're sending)
    console.log("CART ITEMS SENT TO ORDER:", items);

    const orderPayload = {
      totalAmount: cart.totalAmount,
      paymentMode: "COD",
      status: "ORDER_PLACED",

      // 🔥 FORCE CLEAN ARRAY (NO NULL / DUPLICATES)
      items: items.map(i => ({
        productId: Number(i.productId),
        productName: i.productName,
        quantity: Number(i.quantity),
        price: Number(i.price)
      }))
    };

    const orderRes = await fetch("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify(orderPayload)
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      console.error("ORDER ERROR:", err);
      alert("Order failed");
      return;
    }

    await fetch("/customer/cart/clear-cart", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getToken()
      }
    });

    alert("🎉 Order placed successfully");
    window.location.href = "/customer-home.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

/* ===============================
   LOGOUT
================================*/
function logout() {
  localStorage.clear();
  window.location.replace("/index.html");
}


/* ===============================
   FULLSCREEN IMAGE PREVIEW
================================*/
function openFullscreenImage(imageUrl) {

  let modal =
    document.getElementById("fullscreenModal");

  // REMOVE OLD
  if (modal) {
    modal.remove();
  }

  modal = document.createElement("div");

  modal.id = "fullscreenModal";

  modal.innerHTML = `

    <div class="fullscreen-backdrop">

      <span
        class="close-fullscreen"
        onclick="closeFullscreenImage()">

        ✕

      </span>

      <img
        src="${imageUrl}"
        class="fullscreen-image"
      />

    </div>
  `;

  document.body.appendChild(modal);
}

/* ===============================
   CLOSE FULLSCREEN
================================*/
function closeFullscreenImage() {

  const modal =
    document.getElementById("fullscreenModal");

  if (modal) {
    modal.remove();
  }
}

/* ===============================
   INIT
================================*/
document.addEventListener("DOMContentLoaded", () => {
  if (!ensureCustomer()) return;

  if (document.getElementById("cartList")) {
    loadCart();
  }
});
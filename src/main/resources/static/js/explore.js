const BASE_URL = window.location.origin;

function fixExploreImageUrl(url) {

    if (!url) {
        return "https://via.placeholder.com/300?text=No+Image";
    }

    if (
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {
        return url;
    }

    if (url.startsWith("/uploads/")) {
        return BASE_URL + url;
    }

    if (url.startsWith("uploads/")) {
        return BASE_URL + "/" + url;
    }

    return BASE_URL + "/uploads/" + url;
}

async function loadExploreProducts() {

    try {

        const response =
            await fetch("/products");

        const products =
            await response.json();

        renderExploreProducts(products);

    } catch (err) {

        console.error(err);

        document.getElementById(
            "productList"
        ).innerHTML =
            "<h3>Failed to load products</h3>";
    }
}

function renderExploreProducts(products) {

    const container =
        document.getElementById("productList");

    let html = `

        <div class="luxury-toolbar">

            <input
                id="productSearch"
                class="luxury-search"
                placeholder="🔍 Search products">

            <select
                id="categoryFilter"
                class="luxury-filter">

                <option value="">
                    All Collections
                </option>

            </select>

        </div>

        <div class="product-grid">
    `;

    const categories =
        new Set();

    products.forEach(product => {

        categories.add(product.category);

        let mainImage =
            fixExploreImageUrl(
                product.imageUrl
            );

        if (
            product.images &&
            product.images.length > 0
        ) {

            const primary =
                product.images.find(
                    i => i.primaryImage
                );

            mainImage =
                fixExploreImageUrl(
                    primary?.imageUrl ||
                    product.images[0].imageUrl
                );
        }

        let thumbs = "";

        if (product.images) {

            product.images.forEach(img => {

                thumbs += `
                    <img
                        src="${fixExploreImageUrl(img.imageUrl)}"
                        class="mini-thumb"
                        onclick="
                        this.closest('.product-card')
                        .querySelector('.product-img')
                        .src='${fixExploreImageUrl(img.imageUrl)}'
                        ">
                `;
            });
        }

        html += `

            <div class="product-card">

                <div class="image-wrapper">

                    <img
                        src="${mainImage}"
                        class="product-img"
                        onclick="
                        openExploreFullscreenImage(this.src)
                        ">

                    <div class="image-overlay">
                        Premium Collection
                    </div>

                </div>

                <div class="thumbnail-row">
                    ${thumbs}
                </div>

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
                    ${product.stock > 0
                        ? "✅ In Stock"
                        : "❌ Out of Stock"}
                </div>

                <div class="product-actions">

                    <button
                        class="add-btn"
                        onclick="
                        guestAddToCart()
                        ">

                        🛒 Add To Cart

                    </button>

                </div>

            </div>
        `;
    });

    html += "</div>";

    container.innerHTML = html;

    const categorySelect =
        document.getElementById(
            "categoryFilter"
        );

    [...categories]
        .sort()
        .forEach(cat => {

            categorySelect.innerHTML += `
                <option value="${cat}">
                    ${cat}
                </option>
            `;
        });

    setupExploreFilters();
}

function setupExploreFilters() {

    const search =
        document.getElementById(
            "productSearch"
        );

    const category =
        document.getElementById(
            "categoryFilter"
        );

    function apply() {

        const keyword =
            search.value.toLowerCase();

        const cat =
            category.value.toLowerCase();

        document
            .querySelectorAll(".product-card")
            .forEach(card => {

                const name =
                    card.querySelector(
                        ".product-title"
                    ).innerText.toLowerCase();

                const categoryText =
                    card.querySelector(
                        ".product-category"
                    ).innerText.toLowerCase();

                const show =
                    name.includes(keyword)
                    &&
                    (
                        !cat ||
                        categoryText.includes(cat)
                    );

                card.style.display =
                    show ? "block" : "none";
            });
    }

    search.addEventListener(
        "input",
        apply
    );

    category.addEventListener(
        "change",
        apply
    );
}

function guestAddToCart() {

    showLoginRequiredModal();
}

function showLoginRequiredModal() {

    const old =
        document.getElementById(
            "guestLoginModal"
        );

    if (old) old.remove();

    const modal =
        document.createElement("div");

    modal.id =
        "guestLoginModal";

    modal.className =
        "modal-backdrop";

    modal.innerHTML = `

        <div class="login-modal">

            <h2>🔒 Account Required</h2>

            <p style="margin-top:15px">

                Please login or create
                an account to add products
                to your cart and place orders.

            </p>

            <div class="modal-buttons">

                <a
                    href="/login.html"
                    class="login-btn">

                    Login

                </a>

                <a
                    href="/signup.html"
                    class="signup-btn">

                    Create Account

                </a>

            </div>

        </div>
    `;

    modal.onclick = e => {

        if (e.target === modal) {
            modal.remove();
        }
    };

    document.body.appendChild(modal);
}

function openExploreFullscreenImage(src) {

    const old =
        document.getElementById(
            "fullscreenModal"
        );

    if (old) old.remove();

    const modal =
        document.createElement("div");

    modal.id =
        "fullscreenModal";

    modal.innerHTML = `

        <div class="fullscreen-backdrop">

            <span
                class="close-fullscreen"
                onclick="
                closeExploreFullscreenImage()
                ">
                ✕
            </span>

            <img
                src="${src}"
                class="fullscreen-image">

        </div>
    `;

    document.body.appendChild(modal);
}

function closeExploreFullscreenImage() {

    document
        .getElementById(
            "fullscreenModal"
        )?.remove();
}

document.addEventListener(
    "DOMContentLoaded",
    loadExploreProducts
);

function goBack() {
    window.history.back();
}
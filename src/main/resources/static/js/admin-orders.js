// =========================
// ADMIN CHECK
// =========================
function ensureAdmin() {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {

        window.location.href = "/admin-login.html";

        return false;
    }

    return true;
}

let allOrders = [];

// =========================
// LOAD ORDERS
// =========================
async function loadOrders() {

    const token = localStorage.getItem("token");

    try {

        const res = await fetch("/admin/dashboard/orders", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const orders = await res.json();

        allOrders = orders;

        // SORT LATEST FIRST
        orders.sort((a, b) =>
            new Date(b.orderDate) - new Date(a.orderDate)
        );

        const container =
            document.getElementById("ordersContainer");

        container.innerHTML = "";

        // =========================
        // FILTERS
        // =========================
        const selectedStatus =
            document.getElementById("statusFilter")?.value || "ALL";

        const searchText =
            document.getElementById("searchInput")
                ?.value
                .toLowerCase() || "";

        let filteredOrders = orders;

        // STATUS FILTER
        if (selectedStatus !== "ALL") {

            filteredOrders =
                filteredOrders.filter(order =>
                    order.status === selectedStatus
                );
        }

        // SEARCH FILTER
        filteredOrders =
            filteredOrders.filter(order => {

                const customer =
                    order.user?.username?.toLowerCase() || "";

                const orderId =
                    String(order.id);

                return (
                    customer.includes(searchText) ||
                    orderId.includes(searchText)
                );
            });

        let html = "";

        filteredOrders.forEach(order => {

            const orderDate =
                new Date(order.orderDate);

            const now = new Date();

            const diffMinutes =
                (now - orderDate) / (1000 * 60);

            const isNew =
                diffMinutes <= 200 &&
                order.status === "PLACED";

            let itemsHtml = "";

            if (order.items && order.items.length > 0) {

                order.items.forEach(item => {

                    const qty =
                        Number(item.quantity);

                    const price =
                        Number(item.price);

                    const subtotal =
                        qty * price;

                    itemsHtml += `
                        <div class="item-box">

                            <div>
                                <b>Product:</b>
                                ${item.productName}
                            </div>

                            <div>
                                Qty: ${qty}
                            </div>

                            <div>
                                Price: ₹${price}
                            </div>

                            <div>
                                <b>Subtotal:</b>
                                ₹${subtotal}
                            </div>

                        </div>
                    `;
                });
            }

            html += `
                <div class="order-card ${isNew ? 'new-order' : ''}">

                    <div class="order-header">

                        <h3>
                            📦 Order #${order.id}
                        </h3>

                        <span class="status ${order.status}">
                            ${order.status}
                        </span>

                    </div>

                    ${isNew ? `
                        <div class="new-badge">
                            🆕 NEW ORDER
                        </div>
                    ` : ""}

                    <p>
                        <b>👤 Customer:</b>
                        ${order.user?.username || "N/A"}
                    </p>

                    <p>
                        <b>📞 Phone:</b>
                        ${order.user?.phoneNumber || "N/A"}
                    </p>

                    <p>
                        <b>💰 Total:</b>
                        ₹${order.totalAmount}
                    </p>

                    <p>
                        <b>📅 Order Date:</b>
                        ${formatDate(order.orderDate)}
                    </p>

                    <h4>
                        🛒 Products (${order.items?.length || 0})
                    </h4>

                    ${itemsHtml}

                    <div class="admin-box">

                        <select id="status-${order.id}">

                            <option ${order.status === "PLACED" ? "selected" : ""}>
                                PLACED
                            </option>

                            <option ${order.status === "SHIPPED" ? "selected" : ""}>
                                SHIPPED
                            </option>

                            <option ${order.status === "OUT_FOR_DELIVERY" ? "selected" : ""}>
                                OUT_FOR_DELIVERY
                            </option>

                            <option ${order.status === "DELIVERED" ? "selected" : ""}>
                                DELIVERED
                            </option>

                            <option ${order.status === "CANCELLED" ? "selected" : ""}>
                                CANCELLED
                            </option>

                        </select>

                        <button
                            type="button"
                            class="update-btn"
                            data-id="${order.id}"
                        >
                            ✅ Update Status
                        </button>

                    </div>

                </div>
            `;
        });

        container.innerHTML = html;

        updateStats(orders);

    } catch (err) {

        console.error(err);

        alert("Failed to load orders");
    }
}

// =========================
// UPDATE STATUS
// =========================
async function updateStatus(id) {

    const token =
        localStorage.getItem("token");

    const status =
        document.getElementById(`status-${id}`).value;

    try {

        const res = await fetch(
            `/orders/update-status/${id}?status=${status}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const text = await res.text();

        if (!res.ok) {

            alert("Update failed");

            return;
        }

        if (text === "No change in status") {

            alert("No changes made");

            return;
        }

        alert("Status Updated!");

        loadOrders();

    } catch (err) {

        console.error(err);

        alert("Update failed");
    }
}

// =========================
// UPDATE STATS
// =========================
function updateStats(orders) {

    const totalOrders = orders.length;

    const deliveredOrders =
        orders.filter(o =>
            o.status === "DELIVERED"
        ).length;

    const cancelledOrders =
        orders.filter(o =>
            o.status === "CANCELLED"
        ).length;

    const revenue =
        orders
            .filter(o => o.status === "DELIVERED")
            .reduce((sum, order) => {

                return sum + Number(order.totalAmount);

            }, 0);

    document.getElementById(
        "totalOrders"
    ).innerText = totalOrders;

    document.getElementById(
        "deliveredOrders"
    ).innerText = deliveredOrders;

    document.getElementById(
        "cancelledOrders"
    ).innerText = cancelledOrders;

    document.getElementById(
        "totalRevenue"
    ).innerText =
        `₹${revenue.toLocaleString("en-IN")}`;
}

// =========================
// FORMAT DATE
// =========================
function formatDate(dateTime) {

    if (!dateTime) return "N/A";

    return new Date(dateTime).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

// =========================
// BACK BUTTON
// =========================
function goBackToAdminHome() {

    window.location.href =
        "/admin-home.html";
}

// =========================
// INIT
// =========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!ensureAdmin()) return;

        loadOrders();
    }
);



// =========================
// EVENT DELEGATION
// =========================
document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.classList.contains(
                "update-btn"
            )
        ) {

            const id =
                e.target.getAttribute("data-id");

            updateStatus(id);
        }
    }
);

// =========================
// LIVE FILTERS
// =========================
document.addEventListener(
    "input",
    function (e) {

        if (
            e.target.id === "searchInput"
        ) {

            loadOrders();
        }
    }
);

document.addEventListener(
    "change",
    function (e) {

        if (
            e.target.id === "statusFilter"
        ) {

            loadOrders();
        }
    }
);
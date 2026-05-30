function goBackToHome() {
    window.location.href = "/customer-home.html";
}

const steps = ["PLACED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

function getStepUI(status) {
    let html = `<div class="tracker"><div class="line"></div>`;

    steps.forEach(step => {
        html += `
            <div class="step ${steps.indexOf(step) <= steps.indexOf(status) ? 'active' : ''}">
                ${step.replaceAll("_", " ")}
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

async function loadMyOrders() {

    const token = localStorage.getItem("token");

    const res = await fetch("/orders/my", {
        headers: { "Authorization": "Bearer " + token }
    });

    const orders = await res.json();

    const container = document.getElementById("ordersContainer");
    container.innerHTML = "";

    orders.forEach(order => {

        let itemsHtml = order.items.map(item => `
            <div class="item-row">
                <span>${item.productName}</span>
                <span>Qty: ${item.quantity}</span>
                <span>₹${item.price}</span>
            </div>
        `).join("");

        let cancelBtn = order.status === "PLACED"
            ? `<button class="cancel-btn" onclick="cancelOrder(${order.id})">Cancel</button>`
            : "";

        container.innerHTML += `
            <div class="order-card">

                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="status">${order.status}</span>
                </div>

                ${getStepUI(order.status)}

                ${itemsHtml}

                <h3>💰 Total: ₹${order.totalAmount}</h3>

                ${cancelBtn}

            </div>
        `;
    });
}

async function cancelOrder(id) {

    const token = localStorage.getItem("token");

    await fetch(`/orders/cancel/${id}`, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + token }
    });

    alert("Order Cancelled");
    loadMyOrders();
}

loadMyOrders();
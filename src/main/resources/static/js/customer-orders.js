function getToken() {
  return localStorage.getItem("token");
}

function ensureCustomer() {
  const token = getToken();
  const role = localStorage.getItem("role");

  if (!token || role !== "USER") {
    window.location.replace("/login.html");
    return false;
  }
  return true;
}

function logout() {
  localStorage.clear();
  window.location.replace("/index.html");
}

/* ===============================
   LOAD MY ORDERS
================================*/						
async function loadOrders() {
  const res = await fetch("/orders/my", {
    headers: { Authorization: "Bearer " + getToken() }
  });

  if (!res.ok) {
    if (res.status === 401) logout();
    return;
  }

  const orders = await res.json();
  const container = document.getElementById("ordersContainer");

  if (!container) return;

  if (!orders.length) {
    container.innerHTML = "<p>No orders yet 📦</p>";
    return;
  }

  let html = "";

  orders.forEach(order => {
    html += `
      <div class="order-card">
        <h3>Order #${order.id}</h3>
        <p>Total: ₹${order.totalAmount}</p>
        <p>Status: ${order.status}</p>
        <p>Date: ${order.orderDate}</p>

        <hr/>

        <ul>
          ${order.items.map(i => `
            <li>
              ${i.productName} - ${i.quantity} x ₹${i.price}
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ===============================
   INIT
================================*/
document.addEventListener("DOMContentLoaded", () => {
  if (!ensureCustomer()) return;

  if (document.getElementById("ordersContainer")) {
    loadOrders();
  }
});
async function loadDashboardStats() {

	
  const response = await fetch("/admin/dashboard/stats", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });

  if (!response.ok) {
    console.log("Failed to load dashboard");
    return;
  }

  const data = await response.json();
  
  document.getElementById("usersCount").innerText = data.users;
  document.getElementById("productsCount").innerText = data.products;
  document.getElementById("ordersCount").innerText = data.orders;

  document.getElementById("revenueCount").innerHTML =
    `<span class="rupee">₹</span> ${data.revenue}`;
 
}

function goToAdminHome() {
  window.location.href = "/admin-home.html";
}

document.addEventListener("DOMContentLoaded", loadDashboardStats);
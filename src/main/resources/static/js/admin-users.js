const API_URL = "/users";

let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const pageSize = 5;

// ✅ INITIAL LOAD
document.addEventListener("DOMContentLoaded", fetchUsers);

// 🔐 TOKEN
function getToken() {
  return localStorage.getItem("token");
}

// ⚠️ AUTH ERROR HANDLER
function handleAuthError(response) {
  if (response.status === 401 || response.status === 403) {
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "/admin-login.html";
    return true;
  }
  return false;
}

// 👀 FETCH USERS
async function fetchUsers() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": "Bearer " + getToken()
      }
    });

    if (handleAuthError(response)) return;

    if (!response.ok) throw new Error("Failed to fetch users");

    allUsers = await response.json();
    filteredUsers = [...allUsers];

    currentPage = 1;
    renderTable();

  } catch (error) {
    console.error(error);
    alert("Unable to load users");
  }
}

// 🎯 RENDER TABLE WITH PAGINATION
function renderTable() {
  const table = document.getElementById("userTable");

  const start = (currentPage - 1) * pageSize;
  const paginated = filteredUsers.slice(start, start + pageSize);

  table.innerHTML = "";

  if (paginated.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No users found</td></tr>`;
    updatePagination();
    return;
  }

  paginated.forEach(user => {
    table.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.role}</td>
        <td>${user.email}</td>
        <td>${user.address}</td>
        <td>
          <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
          <button class="update-btn" onclick="updateUser(${user.id})">Update</button>
        </td>
      </tr>
    `;
  });

  updatePagination();
}

// 📄 PAGINATION INFO
function updatePagination() {
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages}`;
}

// ⬅️ PREV PAGE
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

// ➡️ NEXT PAGE
function nextPage() {
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

// 🔍 LIVE SEARCH (ID + USERNAME)
function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  if (!query) {
    filteredUsers = [...allUsers];
  } else {
    filteredUsers = allUsers.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.id.toString().includes(query)
    );
  }

  currentPage = 1;
  renderTable();
}

// 🗑 DELETE USER
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + getToken()
      }
    });

    if (handleAuthError(response)) return;

    if (!response.ok) throw new Error();

    alert("User deleted successfully");
    fetchUsers();

  } catch {
    alert("Delete failed");
  }
}

// ✏️ UPDATE USER
async function updateUser(id) {
  const name = prompt("Enter new name:");
  const email = prompt("Enter new email:");
  const address = prompt("Enter new address:");
  const PhoneNumber = prompt("Enter new number:");

  if (!name || !email || !address || !PhoneNumber) {
    alert("All fields are required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
      },
      body: JSON.stringify({ name, email, address, PhoneNumber })
    });

    if (handleAuthError(response)) return;

    if (!response.ok) throw new Error();

    alert("User updated successfully");
    fetchUsers();

  } catch {
    alert("Update failed");
  }
}

// 🚪 LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

// 🔙 BACK TO ADMIN DASHBOARD
function goBack() {
  window.location.href = "/admin-home.html";
}
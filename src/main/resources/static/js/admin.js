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


// =========================
// LOAD ADMIN INFO
// =========================
function loadAdminInfo() {

    const username =
        localStorage.getItem("username");

    const welcomeText =
        document.getElementById("welcomeText");

    if (welcomeText) {

        welcomeText.innerHTML =
            `Welcome Admin, <b>${username || "Admin"}</b>`;
    }
}


// =========================
// LOGOUT
// =========================
function logout() {

    // ✅ CLEAR STORAGE
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    // ✅ REDIRECT
    window.location.href = "/index.html";
}


// =========================
// LOAD NOTIFICATIONS
// =========================
async function loadNotifications() {

    try {

        const token =
            localStorage.getItem("token");

        const res = await fetch(
            "/notifications",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const notifications =
            await res.json();

        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );

        // ✅ SAFETY CHECK
        if (!dropdown) return;

        // ✅ CLEAR OLD
        dropdown.innerHTML = "";

        // ✅ NO NOTIFICATIONS
        if (!notifications ||
            notifications.length === 0) {

            dropdown.innerHTML = `
                <div class="notification-item">
                    No notifications
                </div>
            `;

            return;
        }

        // ✅ RENDER NOTIFICATIONS
        notifications.forEach(notification => {

            dropdown.innerHTML += `
                <div class="notification-item">
                    ${notification.message}
                </div>
            `;
        });

    } catch (error) {

        console.error(
            "Failed to load notifications",
            error
        );
    }
}


// =========================
// TOGGLE NOTIFICATION DROPDOWN
// =========================
function toggleNotifications() {

    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );

    if (!dropdown) return;

    if (
        dropdown.style.display === "block"
    ) {

        dropdown.style.display = "none";

    } else {

        dropdown.style.display = "block";

        loadNotifications();
    }
}


// =========================
// CLOSE DROPDOWN OUTSIDE CLICK
// =========================
document.addEventListener(
    "click",
    function (e) {

        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );

        const notificationContainer =
            document.querySelector(
                ".notification-container"
            );

        if (
            dropdown &&
            notificationContainer &&
            !notificationContainer.contains(
                e.target
            )
        ) {

            dropdown.style.display = "none";
        }
    }
);


// =========================
// INIT
// =========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        // ✅ ADMIN CHECK
        if (!ensureAdmin()) return;

        // ✅ LOAD ADMIN DATA
        loadAdminInfo();

        // ✅ LOAD NOTIFICATIONS
        loadNotifications();
    }
);	
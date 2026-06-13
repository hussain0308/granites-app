	// ================= REGISTER =================
async function registerUser(event) {

    event.preventDefault();

    const message =
        document.getElementById("message");

    // ✅ GET FORM VALUES
    const data = {

        name:
            document.getElementById("name").value.trim(),

        username:
            document.getElementById("username").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        address:
            document.getElementById("address").value.trim(),

        // ✅ FIXED ID + FIELD NAME
        phoneNumber:
            document.getElementById("phoneNumber").value.trim(),

        password:
            document.getElementById("password").value
    };

    // ✅ SIMPLE PHONE VALIDATION
    if (data.phoneNumber.length < 10) {

        message.style.color = "#f87171";

        message.innerText =
            "Please enter valid phone number";

        return;
    }

    try {

        const response = await fetch(
            "/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result =
            await response.json().catch(() => ({}));

        // =========================
        // ✅ SUCCESS
        // =========================
        if (response.ok) {

            message.style.color = "#4ade80";

            message.innerText =
                "Account created successfully! Redirecting...";

            // ✅ CLEAR FORM
            document.getElementById("signupForm").reset();

            setTimeout(() => {

                window.location.href =
                    "/login.html";

            }, 1200);

            return;
        }

        // =========================
        // ❌ ERRORS
        // =========================
        message.style.color = "#f87171";

        if (
            result.message &&
            result.message.includes("User already exists")
        ) {

            message.innerText =
                "Username already exists.";

        } else if (
            result.message &&
            result.message.includes("Email already exists")
        ) {

            message.innerText =
                "Email already exists.";

        } else {

            message.innerText =
                result.message ||
                "Registration failed.";
        }

    } catch (error) {

        console.error(error);

        message.style.color = "#f87171";

        message.innerText =
            "Server not reachable. Try again later.";
    }
}


// ================= LOGIN =================
async function loginUser(event, isAdminLogin = false) {

    event.preventDefault();

    const message =
        document.getElementById("message");

    const data = {

        username:
            document.getElementById("username").value.trim(),

        password:
            document.getElementById("password").value
    };

    try {

        const response = await fetch(
            "/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result =
            await response.json().catch(() => ({}));

        // =========================
        // ❌ LOGIN FAILED
        // =========================
        if (!response.ok) {

            message.style.color = "#f87171";

            message.innerText =
                "Invalid username or password.";

            return;
        }

        // =========================
        // ✅ STORE LOGIN DATA
        // =========================
        localStorage.setItem(
            "token",
            result.token
        );

        localStorage.setItem(
            "username",
            result.username
        );

        localStorage.setItem(
            "role",
            result.role
        );

        // =========================
        // ✅ SUCCESS
        // =========================
        message.style.color = "#4ade80";

        message.innerText =
            "Login successful! Redirecting...";

        setTimeout(() => {

            // ✅ ADMIN REDIRECT
            if (result.role === "ADMIN") {

                window.location.href =
                    "/admin-home.html";

            } else {

                // ✅ CUSTOMER REDIRECT
                window.location.href =
                    "/customer-home.html";
            }

        }, 1000);

    } catch (error) {

        console.error(error);

        message.style.color = "#f87171";

        message.innerText =
            "Server not reachable.";
    }
}


// =========================
// EVENT BINDING
// =========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        const signupForm =
            document.getElementById("signupForm");

        const loginForm =
            document.getElementById("loginForm");

        const adminLoginForm =
            document.getElementById("adminLoginForm");

        // ✅ SIGNUP
        if (signupForm) {

            signupForm.addEventListener(
                "submit",
                registerUser
            );
        }

        // ✅ CUSTOMER LOGIN
        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }

        // ✅ ADMIN LOGIN
        if (adminLoginForm) {

            adminLoginForm.addEventListener(
                "submit",
                (e) => loginUser(e, true)
            );
        }
    }
);
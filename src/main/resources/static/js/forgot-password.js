let verifiedEmail = "";
let otpVerified = false;

let countdown = 120;
let timerInterval;


// =========================
// SEND OTP
// =========================
async function sendOtp() {

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    if (!email) {
        message.style.color = "#f87171";
        message.innerText = "Enter email first";
        return;
    }

    try {

        const res = await fetch(`/api/otp/send?email=${email}`, {
            method: "POST"
        });

        const text = await res.text();

        // 🔥 IMPORTANT FIX HERE
        if (!res.ok) {
            message.style.color = "#f87171";
            message.innerText = text; // 👈 shows "Invalid email format"
            return;
        }

        message.style.color = "#4ade80";
        message.innerText = text;

        startTimer();

        otpVerified = false;
        verifiedEmail = "";

    } catch (err) {

        message.style.color = "#f87171";
        message.innerText = "Server error. Try again later.";
    }
}


// =========================
// TIMER (2 MIN OTP EXPIRY)
// =========================
function startTimer() {

    // 🔥 ALWAYS clear previous timer first
    clearInterval(timerInterval);

    countdown = 120; // reset to 2 minutes

    const timerEl = document.getElementById("timer");
    if (timerEl) {
        timerEl.innerText = "";
    }

    document.getElementById("resendBtn")?.setAttribute("disabled", true);

    timerInterval = setInterval(() => {

        let min = Math.floor(countdown / 60);
        let sec = countdown % 60;

        if (timerEl) {
            timerEl.innerText =
                `OTP expires in ${min}:${sec < 10 ? "0" : ""}${sec}`;
        }

        countdown--;

        if (countdown < 0) {

            clearInterval(timerInterval);

            if (timerEl) {
                timerEl.innerText = "OTP expired. Please resend.";
            }

            document.getElementById("resendBtn")?.removeAttribute("disabled");

            otpVerified = false;
            verifiedEmail = "";
        }

    }, 1000);
}


// =========================
// VERIFY OTP
// =========================
async function verifyOtp() {

    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;
    const message = document.getElementById("message");

    if (!email || !otp) {
        message.style.color = "#f87171";
        message.innerText = "Enter email and OTP";
        return;
    }

    try {

        const res = await fetch(
            `/api/otp/verify?email=${email}&otp=${otp}`,
            { method: "POST" }
        );

        const text = await res.text();

        if (!res.ok) {

            message.style.color = "#f87171";
            message.innerText = text;

            otpVerified = false;
            return;
        }

        verifiedEmail = email;
        otpVerified = true;

        message.style.color = "#4ade80";
        message.innerText = "OTP verified successfully ✔";

        // 🔥 FULL TIMER RESET (IMPORTANT FIX)
        clearInterval(timerInterval);
        countdown = 0;

        const timerEl = document.getElementById("timer");
        if (timerEl) {
            timerEl.innerText = "OTP verified ✔";
        }

        document.getElementById("resendBtn")?.removeAttribute("disabled");

    } catch (err) {

        message.style.color = "#f87171";
        message.innerText = "OTP verification failed";
    }
}


// =========================
// RESET PASSWORD
// =========================
async function resetPassword() {

    const newPassword = document.getElementById("newPassword").value;
    const message = document.getElementById("message");

    if (!otpVerified || !verifiedEmail) {

        message.style.color = "#f87171";
        message.innerText = "Please verify OTP first";
        return;
    }

    if (!newPassword || newPassword.length < 6) {

        message.style.color = "#f87171";
        message.innerText = "Password must be at least 6 characters";
        return;
    }

    try {

        const res = await fetch("/auth/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: verifiedEmail,
                newPassword: newPassword
            })
        });

        const text = await res.text();

        if (!res.ok) {

            message.style.color = "#f87171";
            message.innerText = text;
            return;
        }

        message.style.color = "#4ade80";
        message.innerText = "Password reset successful ✔";

        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1200);

    } catch (err) {

        message.style.color = "#f87171";
        message.innerText = "Reset failed";
    }
}


function goToLogin() {
    window.location.href = "/login.html";
}
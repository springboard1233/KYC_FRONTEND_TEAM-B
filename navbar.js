navbar.js
navbar.js
    // navbar.js

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-dropdown .primary");
    const signupBtn = document.querySelector(".nav-right .ghost");
    const signoutBtn = document.getElementById("signoutBtn");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");

    if (!loginBtn || !signupBtn || !signoutBtn) return;

    // ✅ Update navbar based on login status
    function updateNavbar() {
        const loggedInUser = localStorage.getItem("currentUser");
        const loggedInAdmin = localStorage.getItem("currentAdmin");

        if (loggedInUser || loggedInAdmin) {
            loginBtn.style.display = "none";
            signupBtn.style.display = "none";
            signoutBtn.style.display = "inline-block";
        } else {
            loginBtn.style.display = "inline-block";
            signupBtn.style.display = "inline-block";
            signoutBtn.style.display = "none";
        }
    }

    updateNavbar();

    // ✅ Handle Sign Out with progress animation
    signoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentAdmin");

        const box = document.getElementById("signoutSuccess");
        if (box) {
            const fill = box.querySelector(".signout-progress-fill");
            box.classList.add("show");

            // Reset + animate
            fill.style.width = "0%";
            setTimeout(() => (fill.style.width = "100%"), 50);

            // After animation, redirect
            setTimeout(() => {
                box.classList.remove("show");
                fill.style.width = "0%";
                window.location.href = "/"; // home route
            }, 3600);
        } else {
            // Fallback if box not present
            alert("Signed out successfully!");
            window.location.href = "/"; // home route
        }
    });

    // ✅ Mobile drawer toggle
    if (hamburgerBtn && mobileDrawer) {
        hamburgerBtn.addEventListener("click", () => {
            mobileDrawer.classList.toggle("open");
        });
    }
});
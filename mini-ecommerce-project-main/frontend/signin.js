// signin.js
const BASE_URL = "http://localhost:4000"; // change if backend runs elsewhere

// UI elements
const hamburger = document.getElementById("hamburger");
const sideNav = document.getElementById("side-nav");
const closeBtn = document.getElementById("close-btn");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// hamburger
if (hamburger && sideNav) {
  hamburger.addEventListener("click", () => (sideNav.style.width = "250px"));
  closeBtn?.addEventListener("click", () => (sideNav.style.width = "0"));
}

// tabs
function showLogin() {
  document.querySelector(".tab.active")?.classList.remove("active");
  document.querySelectorAll(".tab")[0].classList.add("active");
  signupForm?.classList.remove("active-form");
  loginForm?.classList.add("active-form");
}
function showSignup() {
  document.querySelector(".tab.active")?.classList.remove("active");
  document.querySelectorAll(".tab")[1].classList.add("active");
  loginForm?.classList.remove("active-form");
  signupForm?.classList.add("active-form");
}

// helpers
const saveAdminToken = (t) => { localStorage.setItem("aToken", t); localStorage.removeItem("uToken"); };
const saveUserToken = (t) => { localStorage.setItem("uToken", t); localStorage.removeItem("aToken"); };

// auto-redirect if already logged in
(() => {
  if (localStorage.getItem("aToken")) {
    location.href = "dashBoard.html";
  } else if (localStorage.getItem("uToken")) {
    location.href = "home.html";
  }
})();

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");

      if (data.aToken) {
        saveAdminToken(data.aToken);
        return (location.href = "dashBoard.html");
      }
      if (data.uToken) {
        saveUserToken(data.uToken);
        return (location.href = "home.html");
      }

      alert("No token received from server");
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error during login");
    }
  });
}

// SIGNUP
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const repwd = document.getElementById("signup-confirm-password").value;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, repwd }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Signup failed");
      alert("Registered successfully. Please log in.");
      showLogin();
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error during signup");
    }
  });
}

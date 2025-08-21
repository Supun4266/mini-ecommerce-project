const hamburger = document.getElementById("hamburger");
const sideNav = document.getElementById("side-nav");
const closeBtn = document.getElementById("close-btn");

hamburger.addEventListener("click", () => {
  sideNav.style.width = "250px";
});

closeBtn.addEventListener("click", () => {
  sideNav.style.width = "0";
});



function showLogin() {
      document.querySelector(".tab.active").classList.remove("active");
      document.querySelectorAll(".tab")[0].classList.add("active");

      document.getElementById("signup-form").classList.remove("active-form");
      document.getElementById("login-form").classList.add("active-form");
    }

    function showSignup() {
      document.querySelector(".tab.active").classList.remove("active");
      document.querySelectorAll(".tab")[1].classList.add("active");

      document.getElementById("login-form").classList.remove("active-form");
      document.getElementById("signup-form").classList.add("active-form");
    }
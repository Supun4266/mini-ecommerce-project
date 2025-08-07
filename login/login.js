function showLogin() {
  document.querySelector(".tab.active").classList.remove("active");
  document.querySelectorAll(".tab")[0].classList.add("active");
  // logic for login view (you can extend this for a full SPA)
}

function showSignup() {
  document.querySelector(".tab.active").classList.remove("active");
  document.querySelectorAll(".tab")[1].classList.add("active");
  // logic for signup view (form swapping can be added here)
}

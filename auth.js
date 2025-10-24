// Toggle password visibility
function togglePassword(id){
  const el = document.getElementById(id);
  el.type = el.type === "password" ? "text" : "password";
}

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    alert("Passwords do not match!");
    return;
  }

  const user = { firstName, lastName, email, phone, password };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Signup successful! Please login.");
  window.location.href = "login.html";
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if(user && user.email === email && user.password === password){
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
});

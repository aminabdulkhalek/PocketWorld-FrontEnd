const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
  localStorage.clear();
  location.href = "../index.html";
});

// user info though local storage
const id = localStorage.getItem("user_id");
const firstName_stored = localStorage.getItem("first_name");
const lastName_stored = localStorage.getItem("last_name");
const email_stored = localStorage.getItem("email");

const userName = document.getElementById("username");
userName.textContent = firstName_stored + " " + lastName_stored;

const userEmail = document.getElementById("user-email");
userEmail.textContent = email_stored.toUpperCase();


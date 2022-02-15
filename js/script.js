

/// sign in 
const signinBtn = document.getElementById("signin-btn");
const emailField = document.getElementById("login-email");
const passwordField = document.getElementById("login-password");

signinBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const email = emailField.value;
  const password = passwordField.value;
  if (email.length ==0){
      emailField.style.border = "1px solid #FF0000";
  }

  if (password.length ==0){
      passwordField.style.border = "1px solid #FF0000";
 }

  fetchLogin(email, password)
});

async function fetchLogin(email, password) {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      email: email,
      password: password,
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/login.php",
      settings
    );
    console.log(response);
    const json = await response.json();
    console.log(json);
    if (json.status != "User not found!" && email.length > 0 && password.length >0) {
      // localStorage.clear();
      localStorage.setItem("user_id", json.user_id);
      localStorage.setItem("first_name", json.first_name);
      localStorage.setItem("last_name", json.last_name);
      location.href = " ./views/home.html";
    }
  } catch (error) {
    console.log("error", error);
  }
}





// sign up section
const registerBtn = document.getElementById("signup-btn");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerFirstName = document.getElementById("register-first-name");
const registerLastName = document.getElementById("register-last-name");


  registerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const email = registerEmail.value;
  const firstName = registerFirstName.value;
  const lastName = registerLastName.value;
  const password = registerPassword.value;
  if (email.length ==0){
    registerEmail.style.border = "1px solid #FF0000";
}
if (password.length ==0){
  registerPassword.style.border = "1px solid #FF0000";
}
if (firstName.length ==0){
  registerFirstName.style.border = "1px solid #FF0000";
}
if (lastName.length==0){
  registerLastName.style.border ="1px solid #FF0000";
}
  fetchRegister(firstName, lastName, email, password);
});

async function fetchRegister(firstName, lastName, email, password) {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/sign_up.php",
      settings
    );
    console.log(response);
    const json = await response.json();
    console.log(json);
    location.reload();
  } catch (error) {
    console.log("error", error);
  }
}



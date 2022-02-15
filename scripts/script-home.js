// redirection to index page and clearing local storage
const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
  localStorage.clear();
  location.href = "../index.html";
});

// getting user info though local storage
const id = localStorage.getItem("user_id");
const firstName_stored = localStorage.getItem("first_name");
const lastName_stored = localStorage.getItem("last_name");
const email_stored = localStorage.getItem("email");

// displaying logged in user name
const userName = document.getElementById("username");
userName.textContent = firstName_stored + " " + lastName_stored;

// displaying logged in email
const userEmail = document.getElementById("user-email");
userEmail.textContent = email_stored.toUpperCase();


// post button and text
const postBtn = document.getElementById("post-button");
const postText = document.getElementById("post-text");

// adding event listener for post button
postBtn.addEventListener("click", function () {
  const postTextValue = postText.value;
  if (postTextValue.length > 0) {
    sendPost(id, postTextValue);
  }
});

// inserting post info to database after posting
async function sendPost(id, text) {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      id: id,
      text: text,
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/add_post.php",
      settings
    );
    console.log(response);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log("error", error);
  }
}


window.onload = function(){
  async function getPosts(id) {
    const settings = {
      method: "POST",
      body: new URLSearchParams({
        id: id,
      }),
    };
    try {
      const response = await fetch(
        "http://localhost/Facebook/php/get_posts.php",
        settings
      );
      // console.log(response);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log("error", error);
    }
  }
  //fetching users posts
  getPosts(id);
  console.log(id);
  // displaying users posts
 
}


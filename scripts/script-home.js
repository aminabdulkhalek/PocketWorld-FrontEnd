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
   //fetching users posts
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
      const postContainer = document.getElementById("post1");
  for (let i=0; i < json.length; i++){
    postContainer.innerHTML +=
  `<div class="post-container" id="post-container">
          <div class="post">
            <img
              src="https://images.unsplash.com/photo-1484186139897-d5fc6b908812?ixlib=rb-0.3.5&s=9358d797b2e1370884aa51b0ab94f706&auto=format&fit=crop&w=200&q=80%20500w"
              class="post-img"
            />
            <h3>Beverly Little</h3>
            <p>${json[i]["post_time"]}</p>
          </div>
          <p class="post-box">
            ${json[i]["Post_content"]}
          </p>
          <hr />
          <a class="like" href=""><i class="fas fa-thumbs-up"></i></a
          ><span>${json[i]["nb_of_likes"]}</span>
          <a class="dislike" href=""><i class="fas fa-thumbs-down"></i></a
          ><span>${json[i]["nb_of_dislikes"]}</span>
        </div>`
  }
  
  
  console.log(json[0]["Post_content"]);
    } catch (error) {
      console.log("error", error);
    }
  }
 
  getPosts(id);

  // displaying users posts

  
  
 
}


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

// event listener for search button
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchUsers);

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
    postText.value = "";
  }
  getPosts(id);
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
    getPosts(id);
  } catch (error) {
    console.log("error", error);
  }
}

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
    const json = await response.json();
    const postContainer = document.getElementById("post1");
    postContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      postContainer.innerHTML += `<div class="post-container" id="post-container">
        <div class="post">
          <img
            src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
            class="post-img"
          />
          <h3 id="fullname${i}"></h3>
          <p>${json[i]["post_time"]}</p>
        </div>
        <p class="post-box">
          ${json[i]["Post_content"]}
        </p>
        <hr />
        <a class="like"><i class="fas fa-thumbs-up" id="like" onclick="addLike(${json[i]["ID"]})"></i></a
        ><span id="${json[i]["ID"]}">${json[i]["nb_of_likes"]}</span>
        <a class="dislike"><i class="fas fa-thumbs-down" onclick="addDislike(${json[i]["ID"]})"></i></a
        ><span id="${json[i]["ID"]}d">${json[i]["nb_of_dislikes"]}</span>
      </div>`;
      getFullName(json[i]["User_ID"], i, 0);
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function getFullName(id, i, method) {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      id: id,
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/get_fullname.php",
      settings
    );
    const json = await response.json();
    if (method == 1) {
      const friendName = document.getElementById(`friendName${i}`);
      friendName.textContent = json.first_name + " " + json.last_name;
    } else if (method == 0) {
      const fullname = document.getElementById(`fullname${i}`);
      fullname.textContent = json.first_name + " " + json.last_name;
    } else if (method == 2) {
      const blockedFriendName = document.getElementById(`blocked-friend${i}`);
      blockedFriendName.textContent = json.first_name + " " + json.last_name;
    } else if (method == 3) {
      const requestName = document.getElementById(`requestName${i}`);
      requestName.textContent = json.first_name + " " + json.last_name;
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function addLike(post_id) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/add_like.php?id=${id}&post_id=${post_id}`
    );
    const json = await response.json();
    document.getElementById(post_id).textContent = json.nb_of_likes;
  } catch (e) {
    console.log("error", e);
  }
}

async function addDislike(post_id) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/add_dislike.php?id=${id}&post_id=${post_id}`
    );
    const json = await response.json();
    document.getElementById(`${post_id}d`).textContent = json.nb_of_dislikes;
  } catch (e) {
    console.log("error", e);
  }
}

async function getfriends() {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/get_friends.php?id=${id}`
    );
    const json = await response.json();
    const friends_count = document.getElementById("friend-count");
    friends_count.textContent = json.length;

    const friendsContainer = document.getElementById("friends");
    friendsContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      friendsContainer.innerHTML += `<div class="ppl" id="friend-div${json[i]["friend"]}">
      <img
        src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
        class="ppl-img"
      />
      <h3 id="friendName${i}"></h3>
      <button class="unfriend" id="unfriendBtn${i}" onclick="unfriend(${json[i]["friend"]})">
        unfriend <i class="fas fa-minus-circle"></i>
      </button>
      <button class="block" id="blockBtnFriend${json[i]["friend"]}" 
      onclick="blockUser(${json[i]["friend"]}, 0)">block <i class="fas fa-ban on"></i></button>
    </div>
    `;
      getFullName(json[i]["friend"], i, 1);
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function acceptRequest(id2) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/accept_request.php?id1=${id}&id2=${id2}`
    );
    const json = await response.json();
    console.log(json);
    getRequests();
    getfriends();
  } catch (e) {
    console.log("Accept request function error", e);
  }
}

async function getRequests() {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/get_requests.php?id=${id}`
    );
    const json = await response.json();
    const requestsContainer = document.getElementById("friend-request");
    requestsContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      requestsContainer.innerHTML += `
      <div class="ppl">
      <img
        src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
        class="ppl-img"
      />
      <h3 id="requestName${i}"></h3>
      <button class="accept" onclick="acceptRequest(${json[i]["request"]})">
        accept <i class="fas fa-check-circle"></i>
      </button>
      <button class="ignore" onclick="unfriend(${json[i]["request"]})">ignore <i class="fas fa-ban"></i></button>
    </div>`;
      getFullName(json[i]["request"], i, 3);
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function unfriend(id2) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/unfriend.php?id1=${id}&id2=${id2}`
    );
    const json = await response.json();
    console.log(json);
    getRequests();
    getfriends();
  } catch (e) {
    console.log("Unfriend function error", e);
  }
}

async function addFriend(id2, i, method) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/add_request.php?id1=${id}&id2=${id2}`
    );
    const json = await response.json();
    console.log(json);
    if (method) {
      const addBtn = document.getElementById(`addBtn${i}`);
      addBtn.className = "added";
    } else {
      getRandomPeople();
    }
  } catch (e) {
    console.log("add friend function error", e);
  }
}

const blocked_count = document.getElementById("blocked-count");

async function getblockedCount() {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/get_blocked.php?id=${id}`
    );
    const json = await response.json();
    // console.log(json);
    blocked_count.textContent = json.length;
  } catch (e) {
    console.log("error", e);
  }
}

async function blockUser(id2, method) {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/block_user.php?id1=${id}&id2=${id2}`
    );
    const json = await response.json();
    if (method) {
      getfriends();
      getblockedCount();
      const blockBtn = document.getElementById(`blockBtn${id2}`);
      if (blockBtn.className === "block") {
        blockBtn.className = "blocked";
      } else {
        document.getElementById(`blocked-user${id2}`).remove();
      }
    } else {
      getfriends();
      getBlockedUsers();
      getblockedCount();
      const blockBtnFriend = document.getElementById(`blockBtnFriend${id2}`);
      if (blockBtnFriend.className === "block") {
        blockBtnFriend.className = "blocked";
      } else {
        blockBtnFriend.className = "block";
      }
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function getBlockedUsers() {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/get_blocked.php?id=${id}`
    );
    const json = await response.json();

    const blockedContainer = document.getElementById("blocked-users");
    blockedContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      blockedContainer.innerHTML += `<div class="ppl" id="blocked-user${json[i]["blocked"]}">
    <img
      src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
      class="ppl-img"
    />
    <h3 id="blocked-friend${i}"></h3>

    <button class="blocked" id="blockBtn${json[i]["blocked"]}" onclick="blockUser(${json[i]["blocked"]}, 1)">block <i class="fas fa-ban"></i></button>
  </div>`;
      getFullName(json[i]["blocked"], i, 2);
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function getMyPosts() {
  try {
    const response = await fetch(
      `http://localhost/Facebook/php/get_user_posts.php?id=${id}`
    );
    const json = await response.json();
    const postContainer = document.getElementById("myPosts");
    postContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      postContainer.innerHTML +=
        `<div class="post-container">
        <textarea class="post-box" id="post_content${i}" rows="3">${json[i]["Post_content"]}</textarea>
        <button class="update" onclick="updatePost(${json[i]["ID"]}, ${i})">update</button>
        <button class="delete" onclick="deletePost(${json[i]["ID"]}, ${i})">delete</button>
        </div>
        <hr/>`;
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function updatePost(post_id, index) {
  const post_text = document.getElementById(`post_content${index}`).value;
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      post_id: post_id,
      text: post_text
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/edit_post.php",
      settings
    );
    const json = await response.json();
    getPosts(id);
  } catch (e) {
    console.log("Update Post Error", e)
  }
}

async function deletePost(post_id) {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      post_id: post_id,
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/delete_post.php",
      settings
    );
    const json = await response.json();
    getPosts(id);
    getMyPosts();
  } catch (e) {
    console.log("Update Post Error", e)
  }
}

async function searchUsers() {
  const searchkey = document.getElementById("search-key").value;
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      id: id,
      key: searchkey
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/search_users.php",
      settings
    );
    const json = await response.json();
    console.log(json);
    const searchedContainer = document.getElementById("searched-people");
    searchedContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      searchedContainer.innerHTML +=
        `<div class="ppl">
        <img
          src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
          class="ppl-img"
        />
        <h3>${json[i]["first_name"] + " " + json[i]["last_name"]}</h3>
        <button class="add" id="addBtn${i}" onclick="addFriend(${json[i]["id"]}, ${i}, ${1})">Add <i class="fas fa-plus-circle"></i></button>
      </div>`;
    }
  } catch (e) {
    console.log("Search Users Error", e)
  }
}

async function getRandomPeople() {
  const settings = {
    method: "POST",
    body: new URLSearchParams({
      id: id,
    }),
  };
  try {
    const response = await fetch(
      "http://localhost/Facebook/php/get_users.php",
      settings
    );
    const json = await response.json();
    console.log(json);
    const randomContainer = document.getElementById("random-container");
    randomContainer.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
      randomContainer.innerHTML +=
        `<div class="ppl">
        <img
          src="https://st.depositphotos.com/1779253/5140/v/380/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg?forcejpeg=true"
          class="ppl-img"
        />
        <h3>${json[i]["first_name"] + " " + json[i]["last_name"]}</h3>
        <a href="" onclick="addFriend(${json[i]["id"]}, ${i}, ${0})"><i class="fas fa-plus-circle"></i></a>
      </div>`;
    }
  } catch (e) {
    console.log("Search Users Error", e)
  }

}




window.onload = function () {
  getPosts(id);
  getfriends();
  getblockedCount();
  getBlockedUsers();
  getMyPosts();
  getRequests();
  getRandomPeople();
};

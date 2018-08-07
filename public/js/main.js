var currentUserUid;
var signOutBtn = document.getElementById("signout-btn");
var menuIcon = document.getElementById("menu-icon");
var navbar = document.getElementById("custom-nav");
var flag = true;
var userUid = localStorage.getItem("userUid");
var messageBox = document.getElementById("message-box");
var currentUserName = document.getElementById("user");




// Getting current logged in user details
window.addEventListener("load", () => {
  db.collection("users")
    .doc(userUid)
    .get()
    .then(data => {
      userName = data.data().userName;
      currentUserName.innerText = userName;
    });
});


function showNav() {
  navbar.style.transform = "translateX(0)";
}
function navClose() {
  navbar.style.transform = "translateX(-100%)";
}

function signOutUser() {
  showLoader('Signing out');
  auth.signOut().then(function() {
    localStorage.removeItem("isUser");
    localStorage.removeItem("userName");
    localStorage.removeItem("sellerUid")
    localStorage.removeItem("userUid") 
    localStorage.removeItem("adId")      
    window.location.assign("index.html");
    hideLoader();
  });
}

// function showMessage(msg) {
//   var messageBox = document.getElementById("message-box");
//   messageBox.style.display = "block";
//   messageBox.innerText = msg;
//   setTimeout(() => {
//     messageBox.style.display = "none";
//   }, 3000);
// }
// function showLoader(text) {
//   var loaderDiv = document.getElementById("loader-div");
//   var loaderText = document.getElementById("loader-text");
//   loaderDiv.style.display = "block";
//   loaderText.innerText = text;
// }
// function hideLoader() {
//   var loaderDiv = document.getElementById("loader-div");
//   loaderDiv.style.display = "none";
// }


// Contact ad's owner
function contactFunc(sellerUid) {
  localStorage.setItem("sellerUid", sellerUid);
  if (userUid === sellerUid) {
    showMessage("This Is Your Add");
    return false;
  }
  window.location.assign("contact.html");
}


// Adding ads offline
function addOffline(adId) {
  showLoader("Adding Offline");
  var adDetailsArr = [];
  if (localStorage.getItem("ads")) {
    adDetailsArr = JSON.parse(localStorage.getItem("ads"));
  }
  db.collection("ads")
    .doc(adId)
    .get()
    .then(data => {
      adDetailsArr.push(data.data());
      localStorage.setItem("ads", JSON.stringify(adDetailsArr));
      var req = new Request(data.data().url, { mode: "no-cors" });
      fetch(req).then(res => {
        caches.open("adsCache").then(cache => {
          console.log("Stored");

          return cache.put(req, res).then(() => {
            hideLoader();
            showMessage("Added Offline");
          });
        });
      });
    });
}


function deleteAd(adId , userId) {
  console.log(userId);
  console.log(userId);
  
  
  db.collection("ads")
    .doc(adId)
    .delete()
    .then(() => {
      console.log("done");
    })
    .catch(() => {
      console.log("error");
    });

  var deleteFromStorage = storageRef.child(adId);
  deleteFromStorage
    .delete()
    .then(() => {
      console.log("done");
    })
    .catch(() => {
      console.log("error");
    });
}


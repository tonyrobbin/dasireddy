// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDsi4jd69OnCt7XQy3ejVJa9Zk2UxXvpHM",
    authDomain: "online-shopping-12.firebaseapp.com",
    databaseURL: "https://online-shopping-12.firebaseio.com",
    projectId: "online-shopping-12",
    storageBucket: "online-shopping-12.appspot.com",
    messagingSenderId: "308900367468"
  };
  firebase.initializeApp(config);

  var auth = firebase.auth();
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref()


  function showMessage(msg) {
    var messageBox = document.getElementById("message-box");
    messageBox.style.display = "block";
    messageBox.innerText = msg;
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }
  function showLoader(text) {
    var loaderDiv = document.getElementById("loader-div");
    var loaderText = document.getElementById("loader-text");
    loaderDiv.style.display = "block";
    loaderText.innerText = text;
  }
  function hideLoader() {
    var loaderDiv = document.getElementById("loader-div");
    loaderDiv.style.display = "none";
  }
  


  if ("serviceWorker" in navigator) {
    
    navigator.serviceWorker.register("./firebase-messaging-sw.js").then(function() {
      console.log("Service Worker Registered");
    });
  }
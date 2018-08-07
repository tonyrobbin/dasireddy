var errorEl = document.getElementById("error");




// Checking  user Loggin Or Logout 
if(localStorage.getItem("isUser") !== null){
  if(location.pathname !== "/ads.html"){
    window.location.assign("ads.html");
  }
}

 if(localStorage.getItem("isUser") === null){
   if(location.pathname === "/ads.html"){
     window.location.assign("index.html")
   }
 }
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //






// USer Sigging in func
function signInUser() {
  var userEmail = document.getElementById("signin-email").value;
  var userPassword = document.getElementById("signin-pwd").value;
  
  showLoader("Signing In")  

  // validate userEmail or UserPass Shuold not empty
  if (userEmail === "" || userPassword === "") {
    hideLoader()
    errorEl.innerText = "fill all fields";
    return false;
  }

  // User Sigging
  auth
    .signInWithEmailAndPassword(userEmail, userPassword)
    .then(data => {
      hideLoader()      
      currentUserUid = data.user.uid;
      localStorage.setItem("userUid", currentUserUid);
      localStorage.setItem("isUser", true);

      db.collection("users")
        .doc(currentUserUid)
        .get()
        .then(doc => {
          hideLoader()          
          var userName = doc.data().userName;
          localStorage.setItem("userName", userName);
          window.location.assign("ads.html")
          
        });
    })
    .catch(err => {
      hideLoader()      
      userEmail.innerText = "";
      userPassword.innerText = "";
      errorEl.innerText = err.message;
    });
};











function createUser(){
  var userName = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("pwd").value;
  var reTypePassword = document.getElementById("pwd2").value;
  
  showLoader("Signing Up")
  
  // If Username field is empty
  if (userName === "") {
    hideLoader()
    errorEl.innerText = "Username is required";
    return false;
  }

  // If Passwords are not same
  if (password !== reTypePassword) {
    hideLoader()    
    errorEl.innerText = "Passwords must be same";
    password.innerText = "";
    reTypePassword.innerText = "";
    return false;
  }

  // Creating User
  auth
  .createUserWithEmailAndPassword(email, password)
    .then(data => {
      currentUserUid = data.user.uid;
      localStorage.setItem("userUid", currentUserUid);

      db.collection("users")
        .doc(currentUserUid)
        .set({
          userName,
          email
        })
        .then(()=>{
          hideLoader()          
          window.location.assign("ads.html")            
        })
      // loaderDiv.style.display = "none";
      localStorage.setItem("isUser", true);

      db.collection("users")
      .doc(currentUserUid)
        .get()
        .then(doc => {
          var userName = doc.data().userName;
          localStorage.setItem("userName", userName);
          console.log(userName);
        });
      })
      .catch(err => {
      hideLoader()      
      // loaderDiv.style.display = "none";
      errorEl.innerText = err.message;
      password.innerText = "";
      reTypePassword.innerText = "";
    });
};



// function showLoader(text){
//   var loaderDiv = document.getElementById("loader-div");
//   var loaderText = document.getElementById("loader-text");
//   loaderDiv.style.display = "block";  
//   loaderText.innerText = text;
// }
// function hideLoader(){
//   var loaderDiv = document.getElementById("loader-div");  
//   loaderDiv.style.display = "none";
// }


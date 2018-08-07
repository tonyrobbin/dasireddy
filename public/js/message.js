var currentUserUid = localStorage.getItem("userUid");
var senderName = localStorage.getItem("userName");
var sellerUid = localStorage.getItem("sellerUid");
var roomId;
var messagesEl = document.getElementById("messages");
var userObj = {
  [currentUserUid]: true,
  [sellerUid]: true,
  createdAt: Date.now()
};

var usersInfo = [currentUserUid, sellerUid];
var isUser = localStorage.getItem("isUser");
var msgDiv = document.getElementById("message-field-div");
if (!isUser) {
  msgDiv.style.display = "none";
}

const messaging = firebase.messaging();

// request for push notiication
messaging
  .requestPermission()
  .then(function() {
    console.log("Notification permission granted.");
    return messaging.getToken();
  })
  .then(function(currentToken) {
    //   saving user token in database
    db.collection("users")
      .doc(currentUserUid)
      .update({
        userToken: currentToken
      });
  })
  .catch(function(err) {
    console.log("Unable to get permission to notify.", err);
  });

messaging.onMessage(payload => {
  console.log("payload", payload);
});

// Getting other user token from database
db.collection("users")
  .doc(sellerUid)
  .get()
  .then(data => {
    sendingToken = data.data().userToken;
  });


// Sending msg function
function sendMsg() {
  var message = document.getElementById("user-message").value;
  var msgObj = {
    message,
    senderUid: currentUserUid,
    senderName,
    receiverId: sellerUid,
    createdAt: Date.now()
  };

  db.collection("rooms")
    .doc(roomId)
    .collection("messages")
    .add(msgObj);
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //


// Fetching messages if contains or else create new room
function fetchMsg() {
  showLoader("Loading Messages")
  db.collection("rooms")
    .where("userObj." + currentUserUid, "==", true)
    .where("userObj." + sellerUid, "==", true)
    .onSnapshot(querySnapshot => {
      if (querySnapshot.empty) {
        db.collection("rooms")
          .add({ userObj, usersInfo })
          .then(doc => {
            roomId = doc.id;
            return false;
          });
      }
      querySnapshot.docChanges().forEach(value => {
        db.collection("rooms")
          .doc(value.doc.id)
          .collection("messages")
          .orderBy("createdAt")
          .onSnapshot(querySnapshot => {
            if(querySnapshot.empty){
              showMessage("No Messages Found")
            }
            
            hideLoader()
            roomId = value.doc.id;
            querySnapshot.docChanges().forEach(value => {
              var senderId  = value.doc.data().senderUid;
              
              messagesEl.innerHTML += `
                             <ul class="list-group  ${senderId === userUid ? "align-right": "align-left marg-bottom"}">
                                 <li class="list-group-item msg-li"> ${
                                   value.doc.data().message
                                 }
                                     <span class="text-right">${
                                       value.doc.data().senderName
                                     }</span>
                                 </li>                   
                             </ul>
                         `;
                         messagesEl.scrollTop = messagesEl.scrollHeight;
                         
            });
          });
      });
    });
}
var currentUserUid = localStorage.getItem("userUid");
console.log(currentUserUid);
var usersChat = document.getElementById("users-list");

showLoader("Fetching Inbox..")

// Fetching all users whom current had chatted before
db.collection("rooms").where("userObj." + currentUserUid , "==" , true)
.onSnapshot((querySnapshot)=>{
    console.log(querySnapshot);
    if(querySnapshot.empty){
        hideLoader()
        showMessage("No Chat")
    }
    querySnapshot.docChanges().forEach(async (value)=>{
        console.log(value.doc.data());
        let otherUserUid;

        // Deciding current and other user uid
        value.doc.data().usersInfo.forEach((user)=>{
            if(user !== currentUserUid){
                otherUserUid = user;
            }
        })
        await db.collection('users').doc(otherUserUid).get()
            .then((snapshot)=>{
                hideLoader();
                contactedUser = snapshot.id;
                
                usersChat.innerHTML += `
                        <li class="list-group-item inbox-list" onClick="chat('${contactedUser}')">${snapshot.data().userName}
                            <span><img src="images/arrow.png" width="25px"></span>
                        </li>
                `
                
            })
        
    })
})

// Redirect user to chat page
function chat(uid){
    localStorage.setItem("sellerUid" , uid);

    window.location.assign("contact.html")
    db.collection("users").doc(uid).collection("messages").get()
    .then((messages)=>{
        
    })

}

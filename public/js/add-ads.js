var imageUploadEl = document.getElementById("file"); // file input ref
var currentUserName; 
var userUid = localStorage.getItem("userUid");
var adDiv = document.getElementById("ad-div"); 
var confirmationMsg = document.getElementById("confirmation-msg-div");
console.log(imageUploadEl.files);
// window.addEventListener('load',()=>{
//   if(!localStorage.getItem("isUser")){
//     var adDiv = document.querySelector('#ad-div');
//     adDiv.style.display = "none"
//   }
// })


// Function For Submit Add
function submitAdd() {
  console.log(imageUploadEl.files);  
  var isUser = localStorage.getItem("isUser");
    var cateogry = document.getElementById("category").value;
    var productName = document.getElementById("product-name").value;
    var productModel = document.getElementById("product-model").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var contactNum = document.getElementById("contact-num").value;
    var address = document.getElementById("address").value;
    if(cateogry === '' || productName === '' || productModel === '' || price === '' || description === '' || contactNum === '' || address === '' || imageUploadEl.files.length < 1){
      showMessage('Please fill all the fields');
      return false;
    }
    showLoader("Submiting Your Ad"); //Loader
    db.collection("users")
      .doc(userUid)
      .get()
      .then(doc => {
        currentUserName = doc.data().userName;
      });
    var file = imageUploadEl.files[0];
    var name = `${+new Date()}-${file.name}`;
    var metaData = { contentType: file.type };

    storageRef
      .child(name)
      .put(file, metaData)
      .then(() => {
        storageRef
          .child(name)
          .getDownloadURL()
          .then(url => {
            db.collection("ads")
              .doc(name)
              .set({
                url,
                cateogry : cateogry.toLowerCase(),
                productName : productName.toLowerCase(),
                productModel,
                address,
                contactNum,
                price,
                description,
                userUid,
                posted_by: currentUserName
              })
              .then(()=>{
                console.log("Uploaded");
                confirmationMsg.style.display = "block";
                adDiv.style.display = "none";
                hideLoader()
              })
          });
      });
}

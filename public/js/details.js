var adId =  localStorage.getItem("adId"); //getting Ad uid from local storage 
var adDetails = document.getElementById("ads-details");

// Fetch an ad details
window.addEventListener("load" , ()=>{
    db.collection("ads").doc(adId).get()
    .then((data)=>{
      console.log(data.data());
      var productName = data.data().productName
      var productModel = data.data().productModel
      var cateogry = data.data().cateogry
      var price = data.data().price
      var posted_by = data.data().posted_by
      var description = data.data().description
      var imageUrl = data.data().url 
      var sellerId = data.data().userUid;
      var contactNumber = data.data().contactNum;
      var address = data.data().address;
      
      adDetails.innerHTML = `
        <div class="img-div text-center my-3">
            <img src = "${imageUrl}" class="img-width" />
        </div>
        <ul class="my-3 list col-10 mx-auto" >
            <li class="list-group-item">
                <span>Cateogry</span>
                <span>${cateogry}</span>
            </li>
            <li class="list-group-item">
                <span>Product Name</span>
                <span>${productName}</span>
            </li>
            <li class="list-group-item">
                <span>Product Model</span>
                <span>${productModel}</span>
            </li>
            <li class="list-group-item">
                <span>Contact Number</span>
                <span>${contactNumber}</span>
            </li>
            <li class="list-group-item">
                <span>Address</span>
                <span>${address}</span>
            </li>
            <li class="list-group-item">
                <span>Description</span>
                <span>${description}</span>
            </li>
            <li class="list-group-item">
                <span>Price</span>
                <span>${price}</span>
            </li>
            <li class="list-group-item">
                <span>Posted_by</span>
                <span>${posted_by}</span>
            </li>
            <li class="list-group-item">
                <button class="btn btn-info" onClick="contactFunc('${sellerId}')">Contact Seller</button>
                <button class="btn btn-danger" onClick="addOffline('${adId}')">Add To Offline</button>
            </li>
            <li class="list-group-item">
                <button class="btn btn-danger ${sellerId !== userUid ? "hide-btn" : "btn-block delete-btn mx-auto"} " onClick="deleteAd('${adId}')">Delete</button>
            </li>
        </ul>
      `
      console.log(sellerId);
      console.log(userUid);
      
      
    })  
})
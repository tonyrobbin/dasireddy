var userUid = localStorage.getItem("userUid");
var userAdsEl = document.getElementById("user-ads");
var adMessgae = document.getElementById("ads-message");


// Fetching current user ads
function FetchAds(){
    showLoader("Fetching Your Ads..")
    db.collection("ads").where("userUid" , "==" , userUid).get()
        .then((data)=>{
            if(data.empty){
                hideLoader()
                adMessgae.style.display = "block"
            }
            
            data.forEach((value)=>{
                hideLoader()
                var productName = value.data().productName
                var productModel = value.data().productModel
                var cateogry = value.data().cateogry
                var price = value.data().price
                var posted_by = value.data().posted_by
                var description = value.data().description
                var imageUrl = value.data().url 
                var sellerId = value.data().userUid;
                var contactNumber = value.data().contactNum;
                var address = value.data().address; 
                
                userAdsEl.innerHTML += `
                <div class="col-md-6 col-12 ads">
                <div id="ad-img-div">
                    <img src="${imageUrl}"/>
                </div>
                    <ul class="list">
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
                </ul>
              `        
            })
            
        })
}
var userUid = localStorage.getItem("userUid");
var adsContainer = document.getElementById("ads-container");
var searchDiv = document.getElementById("search-div");
var searchResult = document.getElementById("search-result-div");

const messaging = firebase.messaging(); //firebase messaging

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
      .doc(userUid)
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


// Fetching ads
function fetchData() {
  // Checking Is User Have Internet connection
  if (!navigator.onLine) {
    var offlineMsg = document.getElementById("offline-msg-div");
    offlineMsg.style.display = "block";
    return false;
  }
  adsContainer.innerHTML = "";
  showLoader("Fetching Ads.."); //loader
  db.collection("ads").onSnapshot(Snapshot => {
    if (Snapshot.empty) {
      hideLoader();
      showMessage("No Ads Availaible");
    }

    Snapshot.docChanges().forEach(change => {
      hideLoader()
      if(change.type === "added"){
        
      var cateogry = change.doc.data().cateogry;
      var productName = change.doc.data().productName;
      var productModel = change.doc.data().productModel;
      var price = change.doc.data().price;
      var description = change.doc.data().description;
      var posted_by = change.doc.data().posted_by;
      var imageUrl = change.doc.data().url;
      var sellerUid = change.doc.data().userUid;
      var adsId = change.doc.id;
      
      adsContainer.innerHTML += `
      <div class="col-md-6 col-12 ads">
            <div id="ad-img-div">
                <img src="${imageUrl}"/>
            </div>
          <ul class="list">
              <li class="list-group-item">
                  <span>Category</span>
                  <span>${cateogry}</span>                        
              </li>
              <li class="list-group-item">
                  <span>Product Name</span>
                  <span>${productName}</span>                        
              </li>
              <li class="list-group-item">
                  <span>Model</span>
                  <span>${productModel}</span>                        
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
                <button class="btn btn-info" onClick="seeDetail('${adsId}')">See Details</button>
                <button class="btn btn-danger" onClick="addOffline('${adsId}')">Add To Offline</button>
              </li>
              <li class="list-group-item">
                <button class="btn btn-success  ${sellerUid !== userUid ? "btn-block" : ""}" onClick="contactFunc('${sellerUid}')">Contact Seller</button>
                <button class="btn btn-danger ${sellerUid !== userUid ? "hide-btn" : ""}" onClick="deleteAd('${adsId}')" id="delete-ad-btn">Delete</button>
            </li>
          </ul>
      </div>
    `;
  
  }

      // When User Delete An Ad
      if(change.type === "removed"){
          adsContainer.innerHTML = '';
          fetchData()  
      }
    });
    
  });
}


// Function For Ad Searching
function searchFunc() {
  var cateogry;
  var productName;
  var productModel;
  var price;
  var description;
  var posted_by;
  var imageUrl;

  var selectInput = document.getElementById("select-input").value;
  var searchInput = document.getElementById("serach-input");

  if (searchInput === "") {
    searchInput.style.border = "2px solid red";
    setTimeout(() => {
      searchInput.style.border = "1px solid lightGray";
    }, 1000);
  } 
  
  // Search By Category Name
  else if (selectInput === "cat") {

    db.collection("ads")
      .where("cateogry", "==", searchInput.value.toLowerCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          adsContainer.innerHTML = "";
          searchResult.innerHTML = `
          <p id="search-result">Your Search Result Not Found
            <img src="images/close.png"/ onClick="closeMsg()" width="20px">
          </p>
        `;
          return false;
        }
        adsContainer.innerHTML = "";
        querySnapshot.forEach(data => {
          var cateogry = data.data().cateogry;
          var productName = data.data().productName;
          var productModel = data.data().productModel;
          var price = data.data().price;
          var sellerUid = data.data().userUid;

          var description = data.data().description;
          var posted_by = data.data().posted_by;
          var imageUrl = data.data().url;
          var adsId = data.id;

          adsContainer.innerHTML += `
          <div class="col-md-5 col-12"  class="ads">
          <div id="ad-img-div">
              <img src="${imageUrl}"/>
          </div>
        <ul class="list">
            <li class="list-group-item">
                <span>Category</span>
                <span>${cateogry}</span>                        
            </li>
            <li class="list-group-item">
                <span>Product Name</span>
                <span>${productName}</span>                        
            </li>
            <li class="list-group-item">
                <span>Model</span>
                <span>${productModel}</span>                        
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
              <button class="btn btn-info" onClick="seeDetail('${adsId}')">See full Details</button>
              <button class="btn btn-danger" onClick="addOffline('${adsId}')")">Add To Offline</button>
            </li>
            <li class="list-group-item">
              <button class="btn btn-success" onClick="contactFunc('${sellerUid}')">Contact Seller</button>
              <button class="btn btn-danger" onClick="deleteAd('${adsId}' , '${sellerUid}')">Delete</button>
          </li>
        </ul>
    </div>
  `;
        });
        searchResult.innerHTML = `
        <p id="search-result">Your Search Result For Cateogry
          <span>${searchInput.value}</span>
          <img src="images/close.png"/ onClick="closeMsg()" width="20px">
        </p>
      `;
      });
  } 
  
  // Search By Product Name
  else if (selectInput === "product") {
    db.collection("ads")
      .where("productName", "==", searchInput.value.toLowerCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          adsContainer.innerHTML = "";
          searchResult.innerHTML = `
          <p id="search-result">Your Search Result Not Found
            <img src="images/close.png"/ onClick="closeMsg()" width="20px">
          </p>
        `;
          return false;
        }

        adsContainer.innerHTML = "";
        querySnapshot.forEach(data => {
          var cateogry = data.data().cateogry;
          var productName = data.data().productName;
          var productModel = data.data().productModel;
          var price = data.data().price;
          var description = data.data().description;
          var posted_by = data.data().posted_by;
          var imageUrl = data.data().url;
          var sellerUid = data.data().userUid;
          var adsId = data.id;

          adsContainer.innerHTML += `
          <div class="col-md-5 col-12"  class="ads">
          <div id="ad-img-div">
              <img src="${imageUrl}"/>
          </div>
        <ul class="list">
            <li class="list-group-item">
                <span>Category</span>
                <span>${cateogry}</span>                        
            </li>
            <li class="list-group-item">
                <span>Product Name</span>
                <span>${productName}</span>                        
            </li>
            <li class="list-group-item">
                <span>Model</span>
                <span>${productModel}</span>                        
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
              <button class="btn btn-info" onClick="seeDetail('${adsId}')">See full Details</button>
              <button class="btn btn-danger" onClick="addOffline('${adsId}')")">Add To Offline</button>
            </li>
            <li class="list-group-item">
              <button class="btn btn-success" onClick="contactFunc('${sellerUid}')">Contact Seller</button>
              <button class="btn btn-danger" onClick="deleteAd('${adsId}' , '${sellerUid}')">Delete</button>
          </li>
        </ul>
    </div>
  `;
        });
        searchResult.innerHTML = `
        <p id="search-result">Your Search Result For Product
          <span>${searchInput.value}</span>
          <img src="images/close.png"/ onClick="closeMsg()" width="20px">
        </p>
      `;
      });
  }
}

// Redirect users to ad details page
function seeDetail(adId) {
  window.location.assign("description.html");
  localStorage.setItem("adId", adId);
}

function closeMsg() {
  searchResult.innerHTML = "";
  fetchData();
}

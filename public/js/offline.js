var adDetails = document.getElementById("ads-details");


// Fetching offline ads from local
window.addEventListener("load" , ()=>{
    if(localStorage.getItem("ads")){
        var savedAdObj  = JSON.parse(localStorage.getItem("ads"));
        console.log(savedAdObj);
        
        for(var i= 0 ; i < savedAdObj.length ; i++){
        var imageUrl = savedAdObj[i].url
        var productName = savedAdObj[i].productName
        var productModel = savedAdObj[i].productModel
        var category = savedAdObj[i].cateogry
        var price = savedAdObj[i].price
        var description = savedAdObj[i].description
        var posted_by = savedAdObj[i].posted_by   
        var address = savedAdObj[i].address;
        var contactNum = savedAdObj[i].contactNum;
        console.log(imageUrl , "hi");
   
        
        adDetails.innerHTML += `
            <div class="text-center my-4">
                <img src="${imageUrl}" class="img-width"/>
            </div>
            <ul class="my-3 list col-10 mx-auto" >
            <li class="list-group-item">
                <span>Cateogry</span>
                <span>${category}</span>
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
                <span>${contactNum}</span>
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
    }
}
else{
    console.log("hi");
    
    showMessage("You Don't Have Saved Ads")
}
})

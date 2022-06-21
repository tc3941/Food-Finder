import * as map from "./map.js";
import * as ajax from "./ajax.js";

let poi;
let nav = false;
let help = false;
let searchField, numSelect, termSelect, resetBtn;
let currentArray = [];
let sortAlpha = true;
let sortCost = true;

const prefix = "tc3941-";
const termKey = prefix + "term";
const searchKey = prefix + "search";
const limitKey = prefix + "limit";

const storedTerm = localStorage.getItem(termKey);
const storedSearch = localStorage.getItem(searchKey);
const storedLimit = localStorage.getItem(limitKey);

function loadPOI(){
    const url = "https://igm.rit.edu/~acjvks/courses/shared/330/maps/igm-points-of-interest.php";

    function poiLoaded(jsonString){
        poi = JSON.parse(jsonString);
        //console.log(poi);

        for(let p of poi){
            map.addMarker(p.coordinates, p.title, "A POI!", "poi")
        }
    }


    ajax.downloadFile(url,poiLoaded);
}

export function init(){
  document.querySelector("#myHelpPanel").style.width = 0;
  document.querySelector("#mySidepanel").style.width = 0;
  searchField = document.querySelector("#search-input");
  numSelect = document.querySelector("#numOfResults");
  termSelect = document.querySelector("#filter");
  resetBtn = document.querySelector("#reset-btn");
    map.initMap();
    if(storedSearch){
      searchField.value = storedSearch;
    }
    else{
      searchField.value = "";
    }

    if(storedTerm){
      termSelect.querySelector(`option[value='${storedTerm}']`).selected = true;
    }

    if(storedLimit){
      numSelect.querySelector(`option[value='${storedLimit}']`).selected = true;
    }
    resetBtn.onclick = e =>{reset();};
searchField.onchange = e =>{localStorage.setItem(searchKey, e.target.value);};
termSelect.onchange = e =>{localStorage.setItem(termKey, e.target.value);};
numSelect.onchange = e =>{localStorage.setItem(limitKey, e.target.value);};
clearSideBar();
//fillSideBar();

//map.loadMarkers();
    //map.addMarkersToMap();
    setupUI();
}

function clearSideBar(){
  let sidePanelElement = document.querySelector("#mySidepanel");

document.querySelector("#mySidepanel").innerHTML="";
let sortButton = document.createElement("button");
//let costSortBtn = document.createElement("button");
sidePanelElement.appendChild(sortButton);
//sidePanelElement.appendChild(costSortBtn);
sortButton.classList.add("btn", "btn-outline-light");
//costSortBtn.classList.add("btn", "btn-outline-light");
sortButton.type = "button";
//costSortBtn.type = "button";
sortButton.id = "sortBtn";
//costSortBtn.id = "sortBtn";

if(!sortAlpha)
sortButton.innerHTML = "Sort by A->Z";
else 
sortButton.innerHTML = "Sort by Z->A";
/*
if(!sortCost)
costSortBtn.innerHTML = "Price ↓";
else 
costSortBtn.innerHTML = "Price ↑";
*/

sortButton.onclick = e=>{
  if(!sortAlpha){
    sortArray(currentArray);
    sortButton.innerHTML = "Sort by Z->A";
  }
  else{
    sortArrayReverse(currentArray);
    sortButton.innerHTML = "Sort by A->Z";
  }

  sortAlpha = !sortAlpha;
  clearSideBar();
  for(let i = 0; i < currentArray.length; i++){
    fillSideBar(currentArray[i]);
  }
}
/*
costSortBtn.onclick = e=>{
  if(!sortAlpha){
    costSortArray(currentArray);
    costSortBtn.innerHTML = "Price ↑";//Descending
  }
  else{
    costSortArrayReverse(currentArray);
    costSortBtn.innerHTML = "Price ↓";//Ascending
  }

  sortCost = !sortCost;
  clearSideBar();
  for(let i = 0; i < currentArray.length; i++){
    fillSideBar(currentArray[i]);
  }
}
*/
}

function fillSideBar(business){
  /*
  <div>
          <button id="sortBtn" type="button" class="btn btn-outline-light">A-Z</button>
            <a href="#" class="storeMini">
                <div class="image-wrapper">
                    <img src="images/100.png" class="storePhotos" alt="placeholder">
                </div>
                <div class="storeInfo">
                    <div>name</div>
                    <p>address1, zip_code</p>
                    <p>city, state</p>
                    <p>is_closed, price</p>
                </div>
            </a>
        </div>
  */
 let rootDiv = document.createElement("div");
 let linkElement = document.createElement("a");
 let imageWrapper = document.createElement("div");
 let imgElement = document.createElement("img");
 let storeRoot = document.createElement("div");
 let storeName = document.createElement("div");
 let storeAddress = document.createElement("p");
 let storeLocation = document.createElement("p");
 let storeMisc = document.createElement("p");

let sidePanelElement = document.querySelector("#mySidepanel");
  sidePanelElement.appendChild(rootDiv);
  sidePanelElement.appendChild(document.createElement("hr"));

  rootDiv.appendChild(linkElement);
linkElement.appendChild(imageWrapper);
  linkElement.href= business.url;
  linkElement.classList.add("storeMini");
imageWrapper.appendChild(imgElement);
  imageWrapper.classList.add("image-wrapper");
  imgElement.classList.add("storePhotos");
  imgElement.alt = business.name + " image";
  imgElement.src = business.image_url;
linkElement.appendChild(storeRoot);
storeRoot.classList.add("storeInfo");
storeRoot.appendChild(storeName);
  storeName.innerHTML = business.name;
storeRoot.appendChild(storeAddress);
storeAddress.innerHTML = business.location.display_address;
storeRoot.appendChild(storeLocation);
for(let i = 0; i<business.transactions.length; i++){
  storeLocation.innerHTML += business.transactions[i];

  if(business.transactions[i+1])
    storeLocation.innerHTML += ", ";
}
if(!business.transactions||business.transactions.length==0)
storeLocation.innerHTML = "Transaction Info Unknown";

if(business.display_phone)
storeLocation.innerHTML += ", " + business.display_phone;
else
storeLocation.innerHTML += ", Phone number Unavaliable.";
storeRoot.appendChild(storeMisc);
let open = business.is_closed ? "Closed" : "Open"
let priceTemp = business.price;
if(!business.price){
  priceTemp = "Prices Unknown"
}

storeMisc.innerHTML =  open + ", " + priceTemp + ", " + business.rating + " (" + business.review_count + ")";



}
function reset(){
  searchField.value = "";
  termSelect.querySelector(`option[value='pizza']`).selected = true;
  numSelect.querySelector(`option[value='15']`).selected = true;
  localStorage.clear();
  clearSideBar();
}
function sortArray(currentArray){
  currentArray.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
});
}
function sortArrayReverse(currentArray){
  currentArray.sort(function(a, b){
    if(a.name > b.name) { return -1; }
    if(a.name < b.name) { return 1; }
    return 0;
});
}

function costSortArray(currentArray){

  currentArray.sort(function(a, b){
    if(String(a.price).length < String(b.price).length) { return -1; }
    if(String(a.price).length > String(b.price).length) { return 1; }
    return 0;
});
}
function costSortArrayReverse(currentArray){

  currentArray.sort(function(a, b){
    if(String(a.price).length > String(b.price).length) { return -1; }
    if(String(a.price).length < String(b.price).length) { return 1; }
    return 0;
});
}

function locationAlert(){
  window.alert("Make sure to put a location!");
}

function priceToNumber(index, arr){
arr[index].price = ("" + arr[index].price).length;
}

let currentLocation;
function setupUI(){
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];
    let coords = [];
    let storeList = [];

    document.querySelector("#search-btn").onclick = () =>{
        const xhr = new XMLHttpRequest();
			let url = "https://people.rit.edu/tc3941/330/Project3/yelp-proxy.php";
            const location = searchField.value;
            const term = getTerm();
            const limit = getLimit();
            url += "?term=" + term;
            url += "&";
            url += "location=" + location;
            url += "&";
            url += "limit=" + limit;

      if(location==""){
        locationAlert();
        return;
      }

			xhr.onerror = (e) => console.log("error");
			
			xhr.onload = (e) => {
        clearSideBar();
               // if(e.total!=0){
                  // console.log(e);
				    const headers = e.target.getAllResponseHeaders();
				    const jsonString = e.target.response;
				    //console.log(`headers = ${headers}`);
				    //console.log(`jsonString = ${jsonString}`);
				
                    const json = JSON.parse(jsonString);
                   // console.log(json.businesses);

                    currentArray = json.businesses;
                    //currentArray.forEach(priceToNumber);
                    //console.log(currentArray);
                    map.cityZoom();
                    map.flyTo([json.region.center.longitude,json.region.center.latitude]);
                    map.clearShops();
                    sortStores(currentArray);
                    for(let i = 0; i<currentArray.length; i++){
                        map.addShop(currentArray[i].coordinates.latitude,currentArray[i].coordinates.longitude,currentArray[i].name,currentArray[i].location.address1)
                        fillSideBar(currentArray[i]);
                      }
                    map.clearMarkers();
                    map.loadMarkers();
                    map.addMarkersToMap();

               // }
			}; // end xhr.onload
			
			xhr.open("GET",url);
			
            xhr.send();
            
    }

    document.querySelector("#location-btn").onclick = () =>{
        getLocation();
            
    }


  document.querySelector("#sideBarBtn").onclick = e =>{
    //open sidebar
    document.querySelector("#mySidepanel").style.width = nav==false ? "450px" : "0px";
    nav = !nav;
  }

  document.querySelector("#help-btn").onclick = e =>{
    //open sidebar
    document.querySelector("#myHelpPanel").style.width = help==false ? "350px" : "0px";
    help = !help;
  }

    //RIT Zoom 15.5
    /*
    btn1.onclick = () =>{
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45,0);
        map.flyTo(lnglatRIT);
    }
    // RIT isometric view
    btn2.onclick = () =>{
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0,0);
        map.flyTo(lnglatRIT);
    }
    //World zoom 0
    btn3.onclick = () =>{
        map.setZoomLevel();
        map.setPitchAndBearing(0,0);
        map.flyTo();
    }
    //IGME zoom 18
    btn4.onclick = () =>{
        map.setZoomLevel(18);
        map.setPitchAndBearing(0,0);
        map.flyTo(lnglatIGM);
    }*/
    /*
    btn5.onclick = () =>{
        if(!poi){
            loadPOI();
        }
    }*/
  }

  function getTerm(){
    return document.querySelector("#filter").value;
  }

  function getLimit(){
    return document.querySelector("#numOfResults").value;
  }

  function sortStores(array){
    if(sortAlpha)
      sortArray(array);
      else
      sortArrayReverse(array);
  }

function goToCurrentLocation(){
    const xhr = new XMLHttpRequest();
    let url = "https://people.rit.edu/tc3941/330/Project3/yelp-proxy.php";
    //const location = document.querySelector("#seatch-input").value;
    const location=currentLocation;
    const term = getTerm();
    const limit = getLimit();
    url += "?term=" + term;
    url += "&";
    url += "latitude=" + location[1];
    url += "&";
    url += "longitude=" + location[0];
    url += "&";
    url += "limit=" + limit;

    xhr.onerror = (e) => console.log("error");
    
    xhr.onload = (e) => {
      clearSideBar();
       // if(e.total!=0){
          // console.log(e);
            const headers = e.target.getAllResponseHeaders();
            const jsonString = e.target.response;
            //console.log(`headers = ${headers}`);
            //console.log(`jsonString = ${jsonString}`);
        
            // update the UI by showing the joke
            const json = JSON.parse(jsonString);
            //console.log(json.region);
            currentArray = json.businesses;
            //currentArray.forEach(priceToNumber);
            //console.log(currentArray);
            map.cityZoom();
            map.flyTo(location);
            map.setZoomLevel(13);
            map.clearShops();
            sortStores(currentArray);
            for(let i = 0; i<currentArray.length; i++){
                map.addShop(currentArray[i].coordinates.latitude,currentArray[i].coordinates.longitude,currentArray[i].name,currentArray[i].location.address1)
                fillSideBar(currentArray[i]);
              }
            map.clearMarkers();
            map.loadMarkers();
            map.addMarkersToMap();

       // }
    }; // end xhr.onload
    
    xhr.open("GET",url);
    

    xhr.send();
  }

  //Methods getLocation,showPosition,showError From https://www.w3schools.com/html/html5_geolocation.asp
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
      window.alert = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude + 
    //"<br>Longitude: " + position.coords.longitude;
    currentLocation = [position.coords.longitude,position.coords.latitude];
    //console.log(currentLocation);
    goToCurrentLocation();
  }
  
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        window.alert = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        window.alert = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        window.alert = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        window.alert = "An unknown error occurred."
        break;
    }
  }

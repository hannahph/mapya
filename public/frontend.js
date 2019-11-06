var map;
  
function changeMap(lat,lng) {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: 8
    });
} 
function searchMap(){
    var enteredURL = document.getElementById('searchBox').value;
    var searchURL = '/post?Url='+encodeURI(enteredURL.toString());
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log(location_response)
        console.log(typeof location_response)
        console.log(location_response[0].name)
        var listprint = ""
        //console.log(xmlHttp.responseText);
        //var newLocation = JSON.parse(xmlHttp.responseText)
        //var newLatLng = newLocation.candidates[0].geometry.location;
        //var newLat = newLatLng.lat;
        //var newLng = newLatLng.lng;
        //changeMap(newLat,newLng); 
        printLocList(location_response, listprint, 'mylist')
    }
    xmlHttp.open("GET", searchURL, false); // true for asynchronous 
    xmlHttp.send();

    
}

function printLocList(li, tag, thisid){
    tag = "";
    //console.log(li)
    for (var i = 0; i<li.length; i++){
      tag += "<li>" + li[i].name + "; Open: " + "<HOURS HERE>" + "</li>";
    }     
    document.getElementById(thisid).innerHTML=tag;
  }
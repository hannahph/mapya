var map;
  
function changeMap(lat,lng) {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: 8
    });
} 
function searchMap(){
    var newPlace = document.getElementById('searchBox').value;
    var searchURL = '/location/'+newPlace.toString();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        console.log(xmlHttp.responseText);
        var newLocation = JSON.parse(xmlHttp.responseText)
        var newLatLng = newLocation.candidates[0].geometry.location;
        var newLat = newLatLng.lat;
        var newLng = newLatLng.lng;
        changeMap(newLat,newLng);
        
    }
    xmlHttp.open("GET", searchURL, false); // true for asynchronous 
    xmlHttp.send();
}
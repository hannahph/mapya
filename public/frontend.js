var map;
  
function changeMap(location) {
map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 8
    });
} 
function searchMap(){
    var enteredURL = document.getElementById('searchBox').value;
    var enteredCity = document.getElementById('cityBox').value; //how can we make it so it immediately resets the map to this city
    var searchURL = '/post?Url='+encodeURI(enteredURL.toString())+"&city="+enteredCity;
    console.log(searchURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log(location_response)
        console.log(typeof location_response)
        console.log(location_response[0].name)
        var listprint = ""
        // filter out null respones 
        location_response = location_response.filter(function(ent){
            return filterNull(ent);
        })

        //filter out the name of the city
        location_response = location_response.filter(function(ent){
            return ent.name!=enteredCity;
        })

        // remove duplicated finds ??? 
        

        //console.log(xmlHttp.responseText);
        //var newLocation = JSON.parse(xmlHttp.responseText)
        //var newLatLng = newLocation.candidates[0].geometry.location;
        //var newLat = newLatLng.lat;
        //var newLng = newLatLng.lng;
        //changeMap(newLat,newLng);
        printLocList(location_response, listprint, 'mylist');
        changeMap(location_response[0].geometry.location);
        plotPlaces(location_response);
    }
    xmlHttp.open("GET", searchURL, false); // true for asynchronous 
    xmlHttp.send();

    
};

function printLocList(li, tag, thisid){
    tag = "";
    console.log(li);
    for (var i = 0; i<li.length; i++){
        if (li[i] !== null){
            tag += "<li>" + li[i].name;
        };
    };     
    document.getElementById(thisid).innerHTML=tag;
  };

function plotPlaces(places_list){
    for (var i = 0; i<places_list.length; i++){
        console.log(places_list[i])
        console.log(places_list[i].geometry.location)
        position = places_list[i].geometry.location
        name = places_list[i].name
        marker = new google.maps.Marker({position: position, map:map, title:name})
    }
}    

function filterNull(iter){
    if (iter == null){
        return false
    }
    else 
        return true
}

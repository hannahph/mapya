var map;
var hotelButtonHtml = '<input type = "text" id="hotelBox" placeholder="Enter Hotel Name"><button onclick = "plotHotel()">Find Hotel</button>';
var latlngbounds = new google.maps.LatLngBounds();
console.log("LATLONG SET: "+latlngbounds);


function changeMap(location) {
map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 12
    });
}

function searchMap(){
    var enteredURL = document.getElementById('searchBox').value;
    var enteredCity = document.getElementById('cityBox').value; 
    var searchURL = '/post?Url='+encodeURI(enteredURL.toString())+"&city="+enteredCity;
    console.log(searchURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log(location_response)
        //console.log(typeof location_response)
        //console.log(location_response[0].name)
        var listprint = ""
        // filter out null respones 
        location_response = location_response.filter(function(ent){
            return filterNull(ent);
        })

        //filter out the name of the city
        location_response = location_response.filter(function(ent){
            return ent.name!=enteredCity;
        })

        // remove duplicated finds
        var dedup_location_names = []
        var dedup_location_response = []
        for (var i =0; i<location_response.length; i++){
            //console.log(dedup_location_names.includes((location_response[i].names)))
            if (dedup_location_names.includes(location_response[i].name)==false){
                //console.log(dedup_location_names)
                //console.log('in if', location_response[i].name)
                dedup_location_response.push(location_response[i]);
                dedup_location_names.push(location_response[i].name);
            }
        }

        console.log('Deduplicated', dedup_location_names)

        //console.log(xmlHttp.responseText);
        //var newLocation = JSON.parse(xmlHttp.responseText)
        //var newLatLng = newLocation.candidates[0].geometry.location;
        //var newLat = newLatLng.lat;
        //var newLng = newLatLng.lng;
        //changeMap(newLat,newLng);
        //printLocList(dedup_location_response, listprint, 'mylist');
        printLocTable(dedup_location_response, listprint, 'mytable')
        console.log(dedup_location_response[0].geometry.location);
        changeMap(dedup_location_response[0].geometry.location);
        plotPlaces(dedup_location_response,"red");
        document.getElementById('hotelOption').innerHTML=hotelButtonHtml;

        //document.getElementById('rowid2').addEventListener("mouseover", alertFunction)
        //document.getElementById('placeid2').addEventListener("mouseover", alertFunction)



    }
    xmlHttp.open("GET", searchURL, true); // true for asynchronous ****Wasn't working until I made this true
    xmlHttp.send();

    
};

function printLocList(li, tag, thisid){
    tag = "";
    //console.log(li);
    for (var i = 0; i<li.length; i++){
        if (li[i] !== null){
            tag += "<li>" + li[i].name;
        };
    };     
    document.getElementById(thisid).innerHTML=tag;
  };

function printLocTable(li, tag, thisid){
    tag = "<tr>"
    for (var i =0; i<li.length; i++){
        if(li[i]!==null){
            id = 'rowid' + (i+1)
            placeid = 'placeid' + (i+1)
            tag+='<th scope="row" id =' + id + '>' + (i+1) + '</th><td id=' + placeid + '>' + li[i].name + "</td></tr>";
        }
    }
    tag+='<tr>'
    console.log(tag)
    document.getElementById(thisid).innerHTML=tag;
}


function plotPlaces(places_list,color){
    console.log(latlngbounds);
    if(latlngbounds == undefined){
        console.log("in undefined loop");
        latlngbounds = new google.maps.LatLngBounds();
    }
    console.log(latlngbounds)
    for (var i = 0; i<places_list.length; i++){
        //console.log(places_list[i])
        //console.log(places_list[i].geometry.location)
        position = places_list[i].geometry.location
        name = places_list[i].name
        var url= "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png";
        console.log(url);
        marker = new google.maps.Marker({position: position, map:map, title:name, icon:url});
        var infowindow = new google.maps.InfoWindow();
        var content = places_list[i].name
        google.maps.event.addListener(marker, 'mouseover', (function(marker, content){
            return function(){
                infowindow.close()
                infowindow.setContent(content);
                infowindow.open(map,marker);
                //windows.push(infowindow)
                // This doesn't seem to work for some reason **** 
                google.maps.event.addListener(map,'click',function(infowindow){
                    return function(){
                        console.log('remove')
                        if (infowindow){
                           infowindow.close();
                       }
                }
                }(infowindow));

            };
            })(marker,content));
        // Figure out how to close info window on mouse move
        latlngbounds.extend(position);
        setrowid='rowid'+(i+1)
        setplaceid = 'placeid'+(i+1)
        document.getElementById(setrowid).addEventListener("mouseover", function(marker, i){
            return function(){
                console.log('alertFunction Activated' + i+1)
                infowindow.setContent(content);
                infowindow.open(map,marker);
                //marker.setAnimation(google.maps.Animation.BOUNCE);
                //setTimeout("marker.setAnimation(null)", 1520);
                };
        }(marker, i));
        document.getElementById(setplaceid).addEventListener("mouseover", function(marker, i, content){
            return function(){
                console.log('alertFunction Activated' + i+1)
                //marker.setAnimation(google.maps.Animation.BOUNCE);
                //setTimeout("marker.setAnimation(null)", 1520);
                infowindow.setContent(content);
                infowindow.open(map,marker);
                };
        }(marker, i, content));    
    }
    map.fitBounds(latlngbounds);
} 

function plotHotel(){
    var enteredHotel = document.getElementById('hotelBox').value;
    var enteredCity = document.getElementById('cityBox').value;
    var searchURL = '/hotel?hotel='+enteredHotel+"&city="+enteredCity;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log(location_response);
        plotPlaces(location_response,"blue");
    };
    xmlHttp.open("GET", searchURL, true); // true for asynchronous ..made this one true too
    xmlHttp.send();
};


function filterNull(iter){
    if (iter == null){
        return false
    }
    else 
        return true
}


function centerMap(){
    var enteredCity = document.getElementById('cityBox').value;
    var searchURL = '/map?&city='+enteredCity;
    console.log(searchURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        var returned_location = JSON.parse(xmlHttp.responseText);
        var city_lat = returned_location[0].geometry.location.lat;
        var city_lng = returned_location[0].geometry.location.lng;
        var city_pos = {lat: city_lat, lng: city_lng};
        changeMap(city_pos);
    };
    xmlHttp.open("GET", searchURL, true); // true for asynchronous ..made this one true too
    xmlHttp.send();
};



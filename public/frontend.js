var map;
var hotelButtonHtml = '<input type = "text" class = "ip2" id="hotelBox" placeholder="Enter Hotel Name"> <button class="btn-2" onclick = "plotHotel()">Find Hotel</button>';
var latlngbounds = new google.maps.LatLngBounds();
console.log("LATLONG SET: "+latlngbounds);
var city_pos
var testURL
var testCity
var tryit=false
var dedup_location_response

function changeMap(location) {
map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 12
    });
}

function runSearch(){
    // here take out the enteredURL enteredCity part... 
    var enteredURL = document.getElementById('searchBox').value;
    var enteredCity = document.getElementById('cityBox').value; 
    searchMap(enteredURL, enteredCity)
}

function searchMap(enteredURL, enteredCity){
    console.log(enteredURL, enteredCity)
    var searchURL = '/post?Url='+encodeURI(enteredURL.toString())+"&city="+enteredCity;
    console.log(searchURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log("LOCATION RESPONSE");
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
            return ent.result.name!=enteredCity;
        })

        // remove duplicated finds
        var dedup_location_names = []
        //making this a global var
        dedup_location_response = [];
        for (var i =0; i<location_response.length; i++){
            //console.log(dedup_location_names.includes((location_response[i].names)))
            if (dedup_location_names.includes(location_response[i].result.name)==false){
                //console.log(dedup_location_names)
                //console.log('in if', location_response[i].name)
                dedup_location_response.push(location_response[i]);
                dedup_location_names.push(location_response[i].result.name);
            }
        }
        
        // also filter by distance here value in the function is the radius allowed in kms 
        console.log('city position', city_pos)
        dedup_location_response=dedup_location_response.filter(function(ent){
            return distanceFilter(ent.result.geometry.location,10)
        })

        console.log('Deduplicated', dedup_location_names)
    //    console.log('distance filtered', dedup_location_response)

        //console.log(xmlHttp.responseText);
        //var newLocation = JSON.parse(xmlHttp.responseText)
        //var newLatLng = newLocation.candidates[0].geometry.location;
        //var newLat = newLatLng.lat;
        //var newLng = newLatLng.lng;
        //changeMap(newLat,newLng);
        //printLocList(dedup_location_response, listprint, 'mylist');
        printLocTable(dedup_location_response, listprint, 'mytable')
        console.log(dedup_location_response[0].result.geometry.location);
        changeMap(dedup_location_response[0].result.geometry.location);
        plotPlaces(dedup_location_response, "none");
        document.getElementById('loader').innerHTML="";
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
            typeid = 'typeid' + (i+1)
            loc_type = li[i].result.types[0].replace("_"," ").replace(/^./, li[i].result.types[0][0].toUpperCase())
            if (li[i].result.opening_hours == undefined){
                var open_hours = " "
            }
            else{
                console.log(String(li[i].result.opening_hours.weekday_text).replace(/,/g,"<br>"))
                var open_hours = String(li[i].result.opening_hours.weekday_text).replace(/,/g,"<br>")
            }
            var website = li[i].result.website
            tag+='<th class = "parent" scope="row" id =' + id + '>' + (i+1) + '</th><td id=' + placeid + '>' + li[i].result.name + "</td><td id=" + typeid +">"+loc_type+"      "+"<span class='close' id="+[i]+">          x</span></td></tr><tr class='child"+id+"' style='display:none;'><td> </td><td colspan='2'><p><a href="+website+">Visit Website</a><br><br>"+open_hours+"</p></td></tr>";
        }
    }
    tag+='<tr>'
    tag = '<tr><th scope="col">#</th><th scope="col">Place</th><th scope="col">Type</th></tr>'+tag
    console.log(tag)
    document.getElementById(thisid).innerHTML=tag;
    //click to remove maker using JQuery
    $(document).ready(function(){
        $("span").off('click').on('click', function (){
            console.log(jQuery(this).attr("id"));
            var idx = jQuery(this).attr("id");
            removeMarker(idx);
        });});
    $(document).ready(function(){
        $(".parent").off('click').on('click', function (){
            console.log(jQuery(this).attr("id"));
            var child_class = ".child"+jQuery(this).attr("id")
            console.log(child_class);
            $(child_class).toggle();
        });});
}


function plotPlaces(places_list, hotelid){
    //console.log(latlngbounds);
    latlngbounds = new google.maps.LatLngBounds();
    if(latlngbounds == undefined){
        console.log("in undefined loop");
        latlngbounds = new google.maps.LatLngBounds();
    }
    //console.log(latlngbounds)
    //create new array of all the markers (not for hotel)
    if(places_list.length>1){
        marker_array = []
        console.log("SETTING MARKER ARRAY TO []")
    }
    console.log(places_list);
    for (var i = 0; i<places_list.length; i++){
        //console.log(places_list[i])
        //console.log(places_list[i].geometry.location)
        position = places_list[i].result.geometry.location        
        name = places_list[i].result.name
        if (i==hotelid){
            color = "blue"
        }
        else{
            color = "red"
        }
        var url= "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png";
        console.log(url);
        marker = new google.maps.Marker({position: position, map:map, title:name, icon:url});
        //add markers to array
        if(places_list.length>1){
            marker_array.push(marker);
        }
        var infowindow = new google.maps.InfoWindow();
        var content = places_list[i].result.name
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
        settypeid = 'typeid'+(i+1)
        document.getElementById(setrowid).addEventListener("mouseover", function(marker, i, content){
            return function(){
                //console.log('alertFunction Activated' + i+1)
                infowindow.setContent(content);
                infowindow.open(map,marker);
                //marker.setAnimation(google.maps.Animation.BOUNCE);
                //setTimeout("marker.setAnimation(null)", 1520);
                };
        }(marker, i, content));
        document.getElementById(setplaceid).addEventListener("mouseover", function(marker, i, content){
            return function(){
                //console.log('alertFunction Activated' + i+1)
                //marker.setAnimation(google.maps.Animation.BOUNCE);
                //setTimeout("marker.setAnimation(null)", 1520);
                infowindow.setContent(content);
                infowindow.open(map,marker);
                };
        }(marker, i, content));    
        document.getElementById(settypeid).addEventListener("mouseover", function(marker, i, content){
            return function(){
                //console.log('alertFunction Activated' + i+1)
                //marker.setAnimation(google.maps.Animation.BOUNCE);
                //setTimeout("marker.setAnimation(null)", 1520);
                infowindow.setContent(content);
                infowindow.open(map,marker);
                };
        }(marker, i, content));    
    }
    //console.log(latlngbounds);
    if(places_list.length>1){
        map.fitBounds(latlngbounds);
    }
} 


function clearMarkers(location_array){
    for (var i=0; i<location_array.length; i++) {
        location_array[i].setMap(null);
      }
      console.log("MAP CLEARED");
      console.log(location_array);
}

function clearOnSearch(){
    document.getElementById('hotelOption').innerHTML=""
    if (typeof marker_array == 'undefined'){
        console.log("marker_array undefined")
        return false;
    }
    else{
        clearMarkers(marker_array);
    }
}

function removeMarker(idx){
    //if (marker_array == undefined){
      //var marker_array = [] 
   // }
    clearMarkers(marker_array);
    var removeID = idx;
    console.log(dedup_location_response[removeID]);
    dedup_location_response.splice(removeID,1);
    marker_array.splice(removeID,1);
    console.log("NEW LIST")
    console.log(dedup_location_response);
    var listprint = ""
    printLocTable(dedup_location_response, listprint, 'mytable')
    plotPlaces(dedup_location_response,"red");
}

function plotHotel(){
    var enteredHotel = document.getElementById('hotelBox').value;
    var enteredCity = document.getElementById('cityBox').value;
    var searchURL = '/hotel?hotel='+enteredHotel+"&city="+enteredCity;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        location_response = JSON.parse(xmlHttp.responseText)
        console.log('hotel', location_response)
        clearMarkers(marker_array)
        var listprint = ""
        location_response[0].result.types[0] = "Your Hotel"
        all_loc_w_hotel = [location_response[0]]
        all_loc_w_hotel = all_loc_w_hotel.concat(dedup_location_response)
        printLocTable(all_loc_w_hotel, listprint, 'mytable')
        //console.log(dedup_location_response[0].result.geometry.location);
        changeMap(all_loc_w_hotel[0].result.geometry.location);
        plotPlaces(all_loc_w_hotel, 0);
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
    var loadingHtml = '<div class="spinner-border ml-auto" role="status" aria-hidden="true"></div><strong>   Loading...</strong>';
    console.log(loadingHtml);
    document.getElementById('loader').innerHTML=loadingHtml;
    if (tryit==true){
        var enteredCity = testCity
    }
    else{
        var enteredCity = document.getElementById('cityBox').value;
    }
    var searchURL = '/map?&city='+enteredCity;
    console.log(searchURL);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        var returned_location = JSON.parse(xmlHttp.responseText);
        var city_lat = returned_location[0].geometry.location.lat;
        var city_lng = returned_location[0].geometry.location.lng;
        city_pos = {lat: city_lat, lng: city_lng};
        changeMap(city_pos);
    };
    xmlHttp.open("GET", searchURL, true); // true for asynchronous ..made this one true too
    xmlHttp.send();
};

function calcDistance(loc1, loc2){
    // function that returns the distance between two places
    lat1 = loc1.lat
    lat2 = loc2.lat
    lon1= loc1.lng
    lon2= loc2.lng
    
    var R = 6371; // km
    var φ1 = degrees_to_radians(lat1);
    var φ2 = degrees_to_radians(lat2);
    var Δφ = degrees_to_radians(lat2-lat1);
    var Δλ = degrees_to_radians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    console.log(d);
    return d
}

//console.log(calcDistance(MIT, Harvard))


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function distanceFilter(loc,radius){
    //returns True if city is within radius
    console.log(calcDistance(city_pos, loc))
    if (calcDistance(city_pos, loc)<radius){
        console.log(true)
        return true
    }
    else
        console.log(false)
        return false
}

function tryit(){
    tryit=true
    modal.style.display = "none";
    testURL='https://theblondeabroad.com/ultimate-london-travel-guide/'
    testCity = 'London'
    centerMap()
    searchMap(testURL, testCity)
}
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//THIS IS HOW WE GET OPENING HOURS

var place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+"**APIKEY**"

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    console.log(xmlHttp.responseText);
}

xmlHttp.open("GET", place_detail_url, false);
xmlHttp.send();
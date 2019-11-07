var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var current_search_term = "Copenhagen Nyhavn"
var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key=AIzaSyCfhcM7UDXq3nHnRIy7VHkWwxati7mAsqc"
console.log(place_url);
var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        var place_search_results = JSON.parse(xmlHttp.responseText);
        //console.log(place_search_results.results[0]);
        //var place_id = place_search_results.results[0].place_id;
        console.log(place_search_results.results[0].name);
    }
xmlHttp.open("GET", place_url, false);
xmlHttp.send();
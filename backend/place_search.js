//given a list of search terms, get a list of lat,long, rating, opening hours of each
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//can delete everything before the function

//var nlpOutput = [{"name":"Amalienborg Palace"},{"name":"World War II.Nyhavn"},{"name":"Oresund Bridge"},{"name":"Danish"},{"name":"København K"},{"name":"Round Tower"},{"name":"Europe"},{"name":"National Museum"},{"name":"Palace.Christiansborg Palace"}]
var nlpOutput = [{"name":"Amalienborg Palace"},{"name":"Nyhavn"},{"name":"Christiansborg Palace"}]
//TODO: Øresund doesn't work, is there a way to convert that to an O?

var search_terms = []
for (i = 0; i < nlpOutput.length; i++) {
    search_terms[i] = "Copenhagen "+ nlpOutput[i].name
}
//console.log(search_terms);

function searchPlaces(search_terms,callback){
    var result_list = []
    for (i = 0; i < search_terms.length; i++) {
        current_search_term = search_terms[i]
        var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key=**ADD API KEY HERE**"
        //TODO: look into region or location/radius to limit results, compared to appending city name
        //console.log(place_url);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            var place_search_results = JSON.parse(xmlHttp.responseText);
            //console.log(place_search_results.results[0]);
            if (place_search_results.results[0]==undefined){
                console.log(current_search_term + " is not a valid search");
            } else{
                var place_id = place_search_results.results[0].place_id;
                //console.log(place_search_results.results[0].name);
                var place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&fields=formatted_address,formatted_phone_number,rating,types,geometry/location,opening_hours/weekday_text&key=**ADD API KEY HERE**"
                //console.log(place_detail_url)
                var xmlHttp2 = new XMLHttpRequest();
                xmlHttp2.onreadystatechange = function() { 
                    place_details = JSON.parse(xmlHttp2.responseText);
                    //console.log(place_details.result);
                    result_list[i] = place_details.result
                    result_list[i].name = place_search_results.results[0].name
                }
                xmlHttp2.open("GET", place_detail_url, false);
                xmlHttp2.send();
        }};
        xmlHttp.open("GET", place_url, false);
        xmlHttp.send();
        
    }
    callback(null, result_list);
}

//console.log(result_list);
module.exports.searchPlaces = searchPlaces;
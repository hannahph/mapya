var searchplaces = require('./place_search.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var nlpOutput = [{"name":"Amalienborg Palace"},{"name":"Nyhavn"},{"name":"Christiansborg Palace"}]

var search_terms = []
for (i = 0; i < nlpOutput.length; i++) {
    search_terms[i] = "Copenhagen "+ nlpOutput[i].name
}


searchplaces.searchPlaces(search_terms,function(err,returned_locations){
    console.log(returned_locations);
});
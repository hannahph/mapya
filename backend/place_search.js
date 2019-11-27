//given a list of search terms, get a list of lat,long, rating, opening hours of each
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//can delete everything before the function

//var nlpOutput = [{"name":"Amalienborg Palace"},{"name":"World War II.Nyhavn"},{"name":"Oresund Bridge"},{"name":"Danish"},{"name":"København K"},{"name":"Round Tower"},{"name":"Europe"},{"name":"National Museum"},{"name":"Palace.Christiansborg Palace"}]
//var nlpOutput = [{"name":"Amalienborg Palace"},{"name":"Nyhavn"},{"name":"Christiansborg Palace"}] // can this line be removed??
//TODO: Øresund doesn't work, is there a way to convert that to an O?

//var search_terms = []
//search_terms[0]="Copenhagen" // we need to change this so copenhagen isn't hard coded
//for (i = 1; i < nlpOutput.length; i++) {
  //  search_terms[i] = "Copenhagen "+ nlpOutput[i].name // we need to change this so copenhagen isn't hard-coded
//}
//console.log(search_terms);

function searchPlaces(search_terms,callback){
  var YOUR_API_KEY ='**API KEY**';
  var place_id_list = []
  var promise_list = []
  var detail_promise_list = [];
  for (i = 0; i < search_terms.length; i++) { 
      current_search_term = search_terms[i]
      var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key="+YOUR_API_KEY;
      promise_list.push(get(place_url))
  }
  Promise.all(promise_list).then(function(values) {
    console.log('searches finished')
    //console.log(values);
    for (i = 0; i<values.length; i++){
        console.log(values[i])
        if(values[i]==null){
            console.log('undefined ' + i)
        }
        else if (values[i].results==undefined){
          console.log('undefined ' + i)
        }
        else if (values[i].results[0]==undefined){
         console.log('undefined '+ i);
       }
         else{
          place_id_list.push(values[i].results[0].place_id)
       }
       }
    console.log('place ids');   
    console.log(place_id_list);
    return(place_id_list);
      }).then(function(place_id_list){
        console.log(place_id_list);
        for (i = 0; i<place_id_list.length; i++){
          var place_id = place_id_list[i];
          console.log("IN THIS LOOP");
          var place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&fields=name,formatted_address,formatted_phone_number,rating,types,geometry/location,opening_hours/weekday_text,website&key="+YOUR_API_KEY;
          console.log(place_detail_url);
          detail_promise_list.push(get(place_detail_url));
        }
        Promise.all(detail_promise_list).then(function(values){
          console.log('detail search finished');
          callback(null, values);
        })})};


function basicSearch(search_terms,callback){
    var result_list = []
    var promise_list = []
   // for (i = 0; i<20; i++){
    for (i = 0; i < search_terms.length; i++) {
        var YOUR_API_KEY ='**API KEY**';
        console.log('searching', search_terms[i])
        //result_list.push(basicSingle(search_terms[i])) 
        current_search_term = search_terms[i]
        var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key="+YOUR_API_KEY;
        promise_list.push(get(place_url))
    }
        Promise.all(promise_list).then(function(values) {
            console.log('searches finished')
            //console.log(values);
            for (i = 0; i<values.length; i++){
                if(values[i]==null){
                    console.log('undefined')
                }
               
                else if (values[i].results[0]==undefined){
                 console.log('undefined')
               }
                 else{
                   result_list.push(values[i].results[0])
               }
            }
            console.log(result_list)
            callback(null, result_list)
          });
          }
          
        // var xmlHttp = new XMLHttpRequest();
        // xmlHttp.onreadystatechange = function() { 
        //     var place_search_results = JSON.parse(xmlHttp.responseText);
        //     //console.log("RESULT:")
        //     //console.log(place_search_results.results[0]);
        //     if (place_search_results.results[0]==undefined){
        //         console.log(current_search_term + " is not a valid search");
        //     } else{
        //         result_list[i] = place_search_results.results[0];
        //     }
        // }
        // xmlHttp.open("GET", place_url, false);
        // xmlHttp.send();
    

//console.log(result_list);
module.exports.searchPlaces = searchPlaces;
module.exports.basicSearch = basicSearch;

function get(url){
    // This function will return a promise, promises use resolve and reject. The resolve is accessed through .then and the reject through the .catch
    return new Promise((resolve, reject)=>{
  
      // Create new XMLhttp (AJAX) Request
      let xhr = new XMLHttpRequest();
      // Sets up the request, setting it to a GET request, pointing to the website and setting it to asynchronous
      xhr.open("GET", url , true);
      //sends the request
      xhr.send();
  
      xhr.onload = ()=>{
        if (xhr.status == 200){
          // When loaded pass the response over to the .then method
          //console.log(JSON.parse(xhr.responseText).result[0].name)
          console.log('request accepted')
          resolve(JSON.parse(xhr.responseText));
        } else {
          // if error pass the status code to the .catch method for error handling
          console.log('request rejected')
          resolve(null)
          //reject(xhr.statusText);
        }
      };
  
      xhr.onerror = ()=>{
        // if error pass the status code to the .catch method for error handling
        console.log('request rejected')
        resolve(null)
        //reject(xhr.statusText && xhr.status);
      };
  
    });
  };
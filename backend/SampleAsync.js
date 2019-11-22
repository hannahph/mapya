/// THIS IS JUST A TRIAL CODE BLOCK TO PRACTICE THE PROMISES STUFF


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// //This part tests the concept with a simple delay function 
//   async function printI(i) {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(i);
//       }, 5000); // this takes 5 seconds to return but would take 50 seconds if it wasn't running in parallel 
//     });
//   }

//   var mylist = []

//  for (var i=0; i<10; i++){
//      mylist.push(printI(i))
//  }

//  Promise.all(mylist).then(function(values) {
//    console.log(values);
//  });


// this part uses the actual places code 

var YOUR_API_KEY ='AIzaSyDYvaowyxOC6QD5P5zcrVeSAzLxI_ZmCGg';
search_terms = ["Copenhagen City Hall", "abcxyz", "Copenhagen Tivoli Gardens", "New York Statute of Liberty", "London Tower", "Eiffel Tower Paris", "MIT Sloan School of Management", "The Design Museum Copenhagen"]
//search_terms = ["Vancouver"]
results = []
place_results_to_FE = []
//current_search_term = "Copenhagen" 



function tryAsync(){

for (i = 0; i<search_terms.length; i++){
    current_search_term = search_terms[i]
    var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key="+YOUR_API_KEY;
    var place_url2 = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+current_search_term+'&inputtype=textquery&fields=geometry&key='+YOUR_API_KEY;
    results.push(get(place_url))
    console.log('results', results)
}

Promise.all(results).then(function(values) {
  console.log(values);
  for (i = 0; i<values.length; i++){
      if (values[i].results[0]==undefined){
        console.log('undefined')
      }
      else{
          place_results_to_FE.push(values[i].results[0])
      }
  }
  console.log(place_results_to_FE)
});
}

//tryAsync()

function regular(){
    return new Promise (resolve =>{
    for (i = 0; i<search_terms.length; i++){
        current_search_term = search_terms[i]
        var place_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+current_search_term+"&key="+YOUR_API_KEY;
        var place_url2 = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+current_search_term+'&inputtype=textquery&fields=geometry&key='+YOUR_API_KEY;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            place = xmlHttp.responseText
            console.log(place);
            //console.log(JSON.parse(xmlHttp.responseText));
            results.push(xmlHttp.responseText)
            //var found = JSON.parse(xmlHttp.responseText);
            //console.log(found)
        }
        xmlHttp.open("GET", place_url);
        xmlHttp.send();
    }
    resolve (results)
})
}



function searchPlace(url){
    return new Promise (function(resolve){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
        //console.log(xmlHttp.responseText)
        place = JSON.parse(xmlHttp.responseText)
        resolve(place)

        //res.send(xmlHttp.responseText);
        };
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
})}


// started working on this before I realized it wasn't working 
function conditionPlace(url){
    (searchPlace(url)).then(function(value){
            //console.log(value)
            //console.log(place_search_results)
            //console.log("RESULT:")
            //console.log(place_search_results.results[0]);
            if (place_search_results.results[0]==undefined){
                console.log(current_search_term + " is not a valid search");
            } else{
                console.log(place_search_results.results[0]);
            }
    //console.log(value)
})
}

//conditionPlace(place_url)



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
          resolve(JSON.parse(xhr.responseText));
        } else {
          // if error pass the status code to the .catch method for error handling
          reject(xhr.statusText);
        }
      };
  
      xhr.onerror = ()=>{
        // if error pass the status code to the .catch method for error handling
        reject(xhr.statusText && xhr.status);
      };
  
    });
  };

//testing detailed search

function searchPlaces(search_terms,callback){
  var YOUR_API_KEY ='AIzaSyDYvaowyxOC6QD5P5zcrVeSAzLxI_ZmCGg';
  var place_id_list = []
  var promise_list = []
  var result_list = [];
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
            console.log('undefined1')
        }
        if (values[i].results==undefined){
          console.log('undefined2')
        }
        else if (values[i].results[0]==undefined){
         console.log('undefined3')
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
          var place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&fields=formatted_address,formatted_phone_number,rating,types,geometry/location,opening_hours/weekday_text&key="+YOUR_API_KEY;
          console.log(place_detail_url);
          detail_promise_list.push(get(place_detail_url));
        }
        Promise.all(detail_promise_list).then(function(values){
          console.log('detail search finished');
          callback(null, values);
       //  }
        })})};
  //    })};


  

searchPlaces(search_terms,function(err,location_details){
  console.log(location_details);
  })

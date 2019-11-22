var express = require('express'); 
var path = require('path');
var app = express();
var nlp_ER = require('./google-nlp.js');
var crawl = require('./web_scraper.js');
var search_places = require('./place_search.js');

//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(express.static('../public/'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/post/',function(req,res){
    //var YOUR_API_KEY ='**API KEY**';
    //var searchURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+req.params.newPlace+'&inputtype=textquery&fields=geometry&key='+YOUR_API_KEY;
    console.log(req.query.Url)
    suppliedUrl=req.query.Url
    var suppliedCity = req.query.city;
    crawl.crawlSite(suppliedUrl, function(err,response){
        blog_text = response
        nlp_ER.runER(blog_text, function(err,returned_locations){
            location_names = []
            for (i=0; i<returned_locations.length; i++){
                location_names[i]=suppliedCity+" "+returned_locations[i].name;
            }
            console.log('location names', location_names);
            search_places.searchPlaces(location_names,function(err,location_details){
                console.log(location_details);
                res.send(JSON.stringify(location_details));
            });
            
        });
    });

});


app.get('/map/',function(req,res){
    var suppliedCity = req.query.city;
    console.log("CENTERING MAP: " + suppliedCity)
    search_places.basicSearch([suppliedCity],function(err,location_details){
        console.log(JSON.stringify(location_details));
        res.send(JSON.stringify(location_details));
    });
});


app.get('/hotel/',function(req,res){
    var suppliedHotel = req.query.hotel + " " + req.query.city;
    console.log("ADDING HOTEL: " + suppliedHotel)
    search_places.searchPlaces([suppliedHotel],function(err,location_details){
        console.log(JSON.stringify(location_details));
        res.send(JSON.stringify(location_details));
    });
});

app.listen(8080);
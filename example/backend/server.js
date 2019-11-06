var express = require('express'); 
var path = require('path');
var app = express();

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(express.static('../public/'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/location/:newPlace',function(req,res){
    var YOUR_API_KEY ='PUTAPIKEYHERE';
    var searchURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+req.params.newPlace+'&inputtype=textquery&fields=geometry&key='+YOUR_API_KEY;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        res.send(xmlHttp.responseText);
    };
    xmlHttp.open("GET", searchURL, false);
    xmlHttp.send();
});

app.listen(8080);
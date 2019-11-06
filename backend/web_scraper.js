var Crawler = require("crawler");
var fs = require('fs');

//var searchUrl = "https://www.ontheluce.com/visiting-copenhagen-on-a-budget/";

//example blog URLS
//"https://www.ontheluce.com/visiting-copenhagen-on-a-budget/";
//"https://heleneinbetween.com/2017/11/top-15-things-copenhagen.html"
//"https://handluggageonly.co.uk/2016/05/22/a-first-timers-guide-to-visiting-copenhagen/"
//"http://www.blondeatlas.com/blog-1//copenhagen-travel-guide" **DOES NOT WORK ON SQUARESPACE**
//"https://shershegoes.com/things-to-do-copenhagen-denmark/"

function crawlSite(searchUrl, callback){
    var blog_content = "";
    var c = new Crawler({
        maxConnections : 10,
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                blog_content = String($("p").text());
                fs.writeFile('blog_content.txt', blog_content, function (err)
                {
                    if (err) throw err;
                    console.log('Saved!');
                });
                //console.log(blog_content);
                callback(null,blog_content)
            }
            done();
        }
    });

    c.queue(searchUrl);
}

module.exports.crawlSite = crawlSite



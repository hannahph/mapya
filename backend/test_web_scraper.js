const fs = require('fs')
var crawl = require('./web_scraper.js');
var suppliedUrl = "https://www.ontheluce.com/visiting-new-york-on-a-budget/"
crawl.crawlSite(suppliedUrl, function(err,response){
    blog_text = response
    fs.writeFile('output.txt', blog_text, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        });
});
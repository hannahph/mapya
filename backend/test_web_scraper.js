var crawl = require('./web_scraper.js');
var suppliedUrl = "https://www.ontheluce.com/visiting-copenhagen-on-a-budget/"
crawl.crawlSite(suppliedUrl, function(err,response){
    blog_text = response
    console.log(blog_text);
});
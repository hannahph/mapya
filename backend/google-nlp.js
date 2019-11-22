// Reference Code based on this: https://www.npmjs.com/package/google-nlp 
// Cities and countries data source: https://datahub.io/core/world-cities 

//	Import this module
const NLP = require('google-nlp')
var database = require('./cities.json');
//const fs = require('fs')
//const crawl = require('./web_scraper.js')

//	Google Cloud API key
const apiKey = '**API KEY**'

// 	Text to send to Google NLP
//var text = 'this is wrong'
//testUrl='https://shershegoes.com/things-to-do-copenhagen-denmark/'

// run crawl site 

//crawl.crawlSite(testUrl, function(err,res){
//    runER(res)
//})

// 	Instantiate he NLP class with your Google Cloud API key
let nlp = new NLP( apiKey )

// fs.readFile('blog_content.txt', (err, data) => {
//     if (err) throw err;
//     //console.log('data', data.toString());
//     text = data.toString();
//     runER(text)
//     //console.log(text)
//   });

/**
 *  Analyze entities from the text string
 */

function runER(text, callback){
 nlp.analyzeEntities( text )
    .then(function( entities ) {
        //console.log(text)
        // 	Output returned entities
        //console.log( 'Entities:', entities );
        //console.log(entities.entities[5].type)
        // Filter to only "Location" Entities 
        loc_entities = entities.entities.filter(function(ent){
            return ent.type=='LOCATION'
        })
        //console.log(loc_entities)
        
        console.log('Total Ent', entities.entities.length)
        console.log('Location Entities', loc_entities.length)
        //console.log('mentions', loc_entities[5].mentions)
        //console.log('Testing filterProper', filterProper(loc_entities[5]))
        
        loc_entities_proper = loc_entities.filter(function(ent){
            return filterProper(ent);
        })

        //***************TESTING PURPOSES - limit results ***********************************
        //loc_entities_proper = loc_entities_proper.slice(1,10);
        //***************TESTING PURPOSES - limit results ***********************************

        console.log('Proper Location Entities', loc_entities_proper.length)
        console.log('Total Proper Locations',loc_entities_proper.length)

        loc_entities_proper_filtered = loc_entities_proper.filter(function(ent){
            return filterSet(ent,citySet);
        })
        console.log('Filtered Proper Locations', loc_entities_proper_filtered.length)
        
        callback(null, loc_entities_proper_filtered)
    })
    
    .catch(function( error ) {
        // 	Error received, output the error
        console.log( 'Error:', error.message );
    
    })
}

//Create function that returns true if the  entity has a "proper" mention
function filterProper(loc_entity){
    isProper=false
    for (var i=0; i<loc_entity.mentions.length; i++)
        //console.log(loc_entity.mentions[i].type=='PROPER')
        if (loc_entity.mentions[i].type=='PROPER') {
            isProper=true
            //console.log(loc_entity.mentions[i].type, isProper)
        }
    return isProper
}

// create sets of countries and cities for filter 
//console.log(database)
citySet= new Set([])
countrySet = new Set([])
for (i =0; i<database.length; i++){
    citySet.add(database[i].name)
}
//console.log(citySet)
//console.log(citySet.size)

for (i =0; i<database.length; i++){
    countrySet.add(database[i].country)
}
//console.log(countrySet.size)


function filterSet(loc_entity){
    if (citySet.has(loc_entity.name) || countrySet.has(loc_entity.name)){
        console.log('Found', loc_entity.name, "..Removing")
        return false
    }
    else{
        return true
    }
}

// This can be used for testing of this module 

//testText="London is separated into many different boroughs and neighborhoods; each offering a unique flavor of the city! The most popular areas worth visiting are: Covent Garden Covent Garden is one of the most popular areas of the city with some of the best theaters. Neal Street is a shoe lover’s paradise with a series of shops catering to every sole. SoHo: A vibrant and exciting part of the city that is home to an amazing range of pubs, jazz and blues bars and the heart of London’s gay scene. This is where many of the fashion forward residents of the city come to party. Kensington + Chelsea: This borough is home to some of London’s most posh shops and luxurious residents. It’s also home to Notting Hill which has become an up-and-coming, trendy neighborhood. Camden: Famous for being the alternative center of London where hippies and punks tread the streets together. It is home to a lively mix of music venues, markets, eateries, tattoo parlors and boutiques. The City of London: The City is actually only about a square mile in size, and is home to London’s biggest skyscrapers and financial district"
//runER(testText, function myvar(err, res){
//    console.log(res)
//})


//THIS IS ALL SAMPLE CODE FOR HOW TO PERFORM OTHER KINDS OF ANALYSES

/**
 *  Analyze sentiment from the text string
 */

// nlp.analyzeSentiment( text )
//     .then(function( sentiment ) {
//         console.log( 'Sentiment:', sentiment );
//     })
//     .catch(function( error ) {
//         console.log( 'Error:', error.message );
//     })


/**
 *  Analyze syntax from the text string
 */

// nlp.analyzeSyntax( text )
//     .then(function( syntax ) {
//         console.log( 'Syntax:', syntax );
//     })
//     .catch(function( error ) {
//         console.log( 'Error:', error.message );
//     })


// /**
//  *  Analyze syntax from the text string
//  */

// //	Default features if `features` param is omitted
// const features = {
//     syntax:    true,
//     entities:  true,
//     sentiment: true
// }

// nlp.annotateText( text, features )
//     .then(function( annotations ) {
//         console.log( 'Annotations:', annotations );
//     })
//     .catch(function( error ) {
//         console.log( 'Error:', error.message );
//     })

module.exports.runER = runER
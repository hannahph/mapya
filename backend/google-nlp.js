// Reference Code based on this: https://www.npmjs.com/package/google-nlp 

//	Import this module
const NLP = require('google-nlp')
//const fs = require('fs')
//const crawl = require('./web_scraper.js')

//	Google Cloud API key
const apiKey = '**ADD API KEY HERE**'

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
        console.log('Proper Location Entities', loc_entities_proper.length)
        //console.log(loc_entities_proper)
        callback(null, loc_entities_proper)
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

// Filter entities to only "Location" entities. 



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

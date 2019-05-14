var parse = require('feed-reader').parse;
let url = 'https://feeds.feedburner.com/TheHackersNews';

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

function parser(url){
    parse(url).then((feed) =>{
    //Lager en ny liste over JSON-objektene
    var njson = feed.entries.map(singleEntry =>{
        var newJson = {};
        newJson['isRegion'] = false;
        newJson['time'] = new Date(singleEntry.publishedDate).getUnixTime();
        newJson['text'] = singleEntry.content;
        newJson["tags1"] = singleEntry.link;
        newJson["tags2"] = singleEntry.author;
        newJson["tags3"] = singleEntry.contentSnipp;  
  njson = newJson;
  return njson;
})
});
}
parser(url);
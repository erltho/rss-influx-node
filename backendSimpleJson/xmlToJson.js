var parse = require('feed-reader').parse;
let url = 'https://feeds.feedburner.com/TheHackersNews';

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

function parser(url){
    parse(url).then((feed) =>{
    //Jeg må først få ut listen over alle sakene
    var njson = feed.entries.map(singleEntry =>{
        //var rObj = {};
        //rObj[singleEntry.key] = singleEntry.value;

        njson['isRegion'] = false;
    
        njson['time'] = new Date(feed.entries.publishedDate).getUnixTime();
        
        njson['text'] = feed.entries.content;

        njson["tags1"] = feed.entries.link;

        njson["tags2"] = feed.entries.author;

        njson["tags3"] = feed.entries.contentSnipp    
    //console.log(feed.entries[entry]);
  njson = feed;
  return njson;
})
});
}
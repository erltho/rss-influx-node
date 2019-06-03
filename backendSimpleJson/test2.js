
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//HER KOMMER PARSER KODEN




function parser() {
    let url = 'https://feeds.feedburner.com/TheHackersNews';
    var parse = require('feed-reader').parse;

    //Parser publishdate to epoch
    Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
    if (!Date.now) Date.now = function () { return new Date(); }
    Date.time = function () { return Date.now().getUnixTime(); }

    //Her skjer selve parsinga
    let feed = parse(url).then((feed) =>
        feed.entries.map(singleEntry => {
            var newJson = {};
            newJson['isRegion'] = false;
            newJson['time'] = new Date(singleEntry.publishedDate).getUnixTime();
            newJson['text'] = singleEntry.content;
            newJson["tags1"] = singleEntry.link;
            newJson["tags2"] = singleEntry.author;
            newJson["tags3"] = singleEntry.contentSnippet;
            return newJson
        })
    ).catch(err =>
    console.error(err))

    return feed;
}


function parseRss() {
    let parsedFeed = parser();
    parsedFeed.then(feed =>console.log(feed)).catch(errorMessage => console.error("hahaha" + errorMessage));
}

parseRss();
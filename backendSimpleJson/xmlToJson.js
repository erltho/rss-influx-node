
let news_feed = {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function parseJson(singleEntry) {
  let newJsonTmp = {}
  newJsonTmp['title'] = singleEntry.title
  //newJsonTmp['isRegion'] = false;
  newJsonTmp['time'] = new Date(singleEntry.publishedDate).getUnixTime();
  newJsonTmp['content'] = singleEntry.content;
  newJsonTmp['link'] = singleEntry.link;
  newJsonTmp['author'] = singleEntry.author;
  newJsonTmp['contentSnippet'] = singleEntry.contentSnippet;
  return newJsonTmp;
}

function parser() {
  var parse = require('feed-reader').parse;
  let url = 'https://feeds.feedburner.com/TheHackersNews';
  //Parser publishdate to epoch
  Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
  if (!Date.now) Date.now = function () { return new Date(); }
  Date.time = function () { return Date.now().getUnixTime(); }
  //Her skjer selve parsinga
  let feed = parse(url).then(feed =>
    feed.entries.map(singleEntry => parseJson(singleEntry))
  )
  //console.log( feed);

  return feed
};

function parseRssFeed() {
  let parsedFeed = parser();
  let topFive = parsedFeed.then(feed => { 
    topFive = feed.slice(0, 5);
    //console.log(topFive.length)
    return topFive
  }
  ).catch(errorMessage => {
    console.error("holy crap errors" + errorMessage)
  })
  return topFive;
}

/*function getTitle() {
  let feed = parseRssFeed()
  return topFive[0].title
  
}

getTitle();
*/
/*function getTitle() {
  var title = getTopFive.then(news_feed[1]['title'])
  return title;
}
getTitle()

function getTopFive(feed) {
  let topFive = feed.slice(0, 5);
  console.log(topFive.length)
  return topFive;
};

//console.log(getTitle());
*/

function test(){
  let print = parseRssFeed().then(topFive => console.log(topFive))
}

test();
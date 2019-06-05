//Først så setter vi inn parsekoden

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function parseJson(singleEntry) {
  let newJsonTmp = {}
  newJsonTmp['title'] = singleEntry.title
  //newJsonTmp['isRegion'] = false;
  newJsonTmp['timestamp'] = singleEntry.publishedDate;
  newJsonTmp['content'] = singleEntry.content;
  newJsonTmp['url'] = singleEntry.link;
  newJsonTmp['author'] = singleEntry.author;
  newJsonTmp['contentSnippet'] = singleEntry.contentSnippet;
  return newJsonTmp;
}

function parser() {
  var parse = require('feed-reader').parse;
  let url = 'https://feeds.feedburner.com/TheHackersNews';
  /*//Parser publishdate to epoch
  Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
  if (!Date.now) Date.now = function () { return new Date(); }
  Date.time = function () { return Date.now().getUnixTime(); }
  */
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

//************************************Sender til influx*************************************/
var express = require('express');
var app = express();
const Influx = require('influx');
var forEach = Array.prototype.forEach;

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'rss',
  schema: [
    {
      measurement: 'newsfeed',
      fields: {
        title: Influx.FieldType.STRING,
        content: Influx.FieldType.STRING,
        timestamp: Influx.FieldType.STRING,
        contentSnippet: Influx.FieldType.STRING
      },
      tags: [
        'url' 
      ]
    }
  ]
});
//checking the databases
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('rss')) {
      return influx.createDatabase('rss');
    }
  })
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Listening on ${app.get('port')}.`);
    });
    //Husk å skift denne dataen senere
    parseRssFeed().then(topFive => topFive.map(feed => writeDataToInflux(feed))
      //topFive.map(feed => writeDataToInflux(feed))

      //console.log(topFive)
      //topFive.forEach(writeDataToInflux(data))
      //forEach.call(topFive.feed, writeDataToInflux(data));
    ).catch(errorMessage => console.log("denne failet ved writeData" + errorMessage));
    //writeDataToInflux(newsfeed);
    //writeDataToInflux(hilo);
    //writeDataToInflux(honolulu);
    //writeDataToInflux(kahului);
  })
  .catch(error => console.log({ error }));

//Writing data to influx
function writeDataToInflux(data) {
  var content = data.content;
  var title = data.title;
  var timestamp = data.timestamp;
  var urlData = data.url;
  var author = data.author;
  var contentSnippet = data.contentSnippet;

  console.log(timestamp);

  influx.writePoints([
    {
      measurement: 'newsfeed',
      tags: {url: urlData},
      fields: {title, content, timestamp, contentSnippet},
    }
  ], {
      database: 'rss',
      precision: 's',
    })
    .catch(error => {
      console.error("Error saving data to InfluxDB" + error)
    });
}

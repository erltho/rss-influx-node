/*// Setting TLS
'use strict';

var request = require('request');
var agentOptions;
var agent;
var https = require('https');
var url;

agentOptions = {
  host: 'https://hnrss.org/newest'
, port: '443'
, path: '/'
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: url,
  agentOptions: {
    rejectUnauthorized: false
  }
}, function (err, resp, body) {
  // ...
});*/


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//Get Unix Timestamp from Date

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

//HER KOMMER PARSER KODEN

const express = require('express')
const app = express();
import {parser} from 'xmlToJson';





app.get('/', (req, res) => {

  
  var parse = require('feed-reader').parse;

  let url = 'https://feeds.feedburner.com/TheHackersNews';
  
  
 /* parse(url).then((feed) => {
    console.log(feed);
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    console.log('Everything done');
  });

  parse(url).then((feed) =>{
    for (entry in feed.entries){

      feed.entries[entry]['isRegion'] = false;

      //feed.entries[entry].time = feed.entries[entry].publishedDate;
      
      feed.entries[entry]['time'] = new Date(feed.entries[entry].publishedDate).getUnixTime();
      delete feed.entries[entry].publishedDate;

      feed.entries[entry].text = feed.entries[entry].content;
      delete feed.entries[entry].content;

      feed.entries[entry].tags1 = feed.entries[entry].link;
      delete feed.entries[entry].link;

      feed.entries[entry].tags2 = feed.entries[entry].author;
      delete feed.entries[entry].author;

      feed.entries[entry].tags3 = feed.entries[entry].contentSnippet;
      delete feed.entries[entry].contentSnippet;
      //console.log(feed.entries[entry]);
    }
    njson = feed;
    console.log(njson);
  });
  */
});
app.listen(8000, () => {
  
  console.log('Example app listening on port 8000!')
});

//Setter opp CORS
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); //denne bør endres for å gjøre det sikrere
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}

//Grafana forventer disse responsene i Annotation
  
//Nå skal vi sette opp url og respons 
app.all('/', function(req, res) {
  setCORSHeaders(res);
  res.send('Welcome to the RSS feed in JSON');
  res.end();
  console.log("Nå har du kommet hit");
});

app.all('/annotations', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(njson);
  res.end();
});

app.all('/search', function(req, res){
  setCORSHeaders(res);
  var result = ["upper_25","upper_50","upper_75","upper_90","upper_95"];
  res.json(result);
  res.end();
});

app.all('/query', function(req, res){
  /*var rows = [];
  for (i in njson.entries){
    var entryRow = [];
    entryRow.push(njson[i].time);
    console.log(njson[i].time);


  }*/
  console.log();
  var queryRes = [
    {
      "columns":[
        {"text":"Time","type":"time"},
        {"text":"Header","type":"string"},
        {"text":"Link","type":"string"}
      ],
      "rows":[
        [,"SE",123],
        [1234567,"DE",231],
        [1234567,"US",321]
      ],
      "type":"table"
    }
  ]
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);
  //console.log(json)
 
  res.json({ "target": "upper_50", "refId": "A", "type": "timeseries", "data": { "additional": njson } });
  res.end();
});

var feed = require('rss-to-json');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function parser() {
    feed.load('https://feeds.feedburner.com/TheHackersNews', function (err, rss) {
        //console.log(rss)
        let topFive = rss.items.slice(0,5)
        topFive.map(element => {
            delete element.url;
            delete element.media;
            return topFive;
        });
        
        console.log(topFive);
        return topFive;

    });
}

console.log(parser());


/*let formated = rss.items.slice(0, 5)
        formated.map(singleEntry => {
            formated['title'] = singleEntry.title;
            //formated['time'] = new Date(singleEntry.publishedDate).getUnixTime();
            formated['time'] = singleEntry.created;
            formated['content'] = singleEntry.description;
            formated['link'] = singleEntry.link;
            //formated['author'] = singleEntry.author;
            //formated['contentSnippet'] = singleEntry.contentSnippet;
            return formated;
        })
        return formated;
    });
    return formated; */
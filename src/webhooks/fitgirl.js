require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Parser = require("rss-parser");
const { memesChannel } = require("../../config.json");

module.exports = (client) => {
  client.on("ready", async () => {
    let feeds = [];
    let feedIndex = 0;

    var refreshFeeds = () => {
      feeds = [];
      feedIndex = 0;
      (async () => {
        var parser = new Parser();
        var feed = await parser.parseURL("https://www.anandtech.com/rss/");
        feed.items.forEach((item) => {
          var links = item.link;
          console.log(links);
        });

        sendFeed();
      })();
    };

    var sendFeed = () => {
      var feedMsg = feed[feedIndex];
      feedChannel.send(feedMsg);
      feedIndex += 1;
      if (feedIndex >= feeds.length) {
        refreshMemes();
      }
    };
    client.on("ready", () => {
      console.log("Feeds online.");
      memeChannel = client.channels.cache.get(memesChannel);
      console.log(sendFeed);
      refreshFeeds();
      setInterval(sendFeed, 7200000);
    });
  });
};

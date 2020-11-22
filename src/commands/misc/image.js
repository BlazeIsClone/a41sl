const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

var cheerio = require("cheerio"); /* Used to extract html content, based on jQuery || install with npm install cheerio */
var request = require("request"); /* Used to make requests to URLs and fetch response  || install with npm install request */
const { PREFIX } = require("../../../config.json");
module.exports = (client) => {
  client.on("message", (message) => {
    var parts = message.content.split(" "); // Splits message into an array for every space, our layout: "<command> [search query]" will become ["<command>", "search query"]

    /* Simple command manager */

    const useCmd = new MessageEmbed()
      .setDescription("Usage: /image <image name> ")
      .setTitle("Search Images");
    if (message.content === PREFIX + "image") {
      message.reply(useCmd).catch(console.error);
    }
    if (parts[0] === PREFIX + "image") {
      // Check if first part of message is image command

      // call the image function
      image(message, parts); // Pass requester message to image function
    }
  });

  function image(message, parts) {
    /* extract search query from message */

    var search = parts.slice(1).join(" "); // Slices of the command part of the array ["!image", "cute", "dog"] ---> ["cute", "dog"] ---> "cute dog"

    var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + search,
      method: "GET",
      headers: {
        Accept: "text/html",
        "User-Agent": "Chrome",
      },
    };
    request(options, function (error, response, responseBody) {
      if (error) {
        // handle error
        return;
      }

      /* Extract image URLs from responseBody using cheerio */

      $ = cheerio.load(responseBody); // load responseBody into cheerio (jQuery)

      // In this search engine they use ".image a.link" as their css selector for image links
      var links = $(".image a.link");

      // We want to fetch the URLs not the DOM nodes, we do this with jQuery's .attr() function
      // this line might be hard to understand but it goes thru all the links (DOM) and stores each url in an array called urls
      var urls = new Array(links.length)
        .fill(0)
        .map((v, i) => links.eq(i).attr("href"));
      //console.log(urls);
      if (!urls.length) {
        // Handle no results
        return;
      }

      // Send result
      const onLoad = new MessageEmbed().setDescription("⌛ Loading..");
      const resEmbed = new MessageEmbed().setImage(urls[0]);
      (async () => {
        await message.channel
          .send(onLoad)
          .then((onLoad) => onLoad.edit(resEmbed))
          .catch(console.error);
      })();
    });
  }
};

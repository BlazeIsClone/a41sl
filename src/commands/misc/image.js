const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

var cheerio = require("cheerio");
var request = require("request");

module.exports.run = (client, message, args) => {
  var parts = message.content.split(" ");
  const useCmd = new MessageEmbed()
    .setDescription("Usage: /image <image name> ")
    .setTitle("Search Images");
  message.reply(useCmd).catch(console.error);
  image(message, parts);
};

var image = (message, parts) => {
  var search = parts.slice(1).join(" ");
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
      return;
    }

    $ = cheerio.load(responseBody);

    var links = $(".image a.link");

    var urls = new Array(links.length)
      .fill(0)
      .map((v, i) => links.eq(i).attr("href"));
    if (!urls.length) {
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
};

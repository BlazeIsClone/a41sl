const Discord = require("discord.js");
const fetch = require("node-fetch");
const request = require("request");
const { memesChannel } = require("../../../config.json");
const { MessageEmbed } = require("discord.js");
const { PREFIX } = require("../../../config.json");

module.exports = async (client) => {
  client.on("message", async (message) => {
    const useCmd = new MessageEmbed()
      .setDescription("Usage: /nasa <question> ")
      .setTitle("NASA");
    if (message.content === PREFIX + "nasa") {
      message.reply(useCmd).catch(console.error);
    }
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    let args = message.content.slice(PREFIX.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();

    if (command === "nasa") {
      if (!args) {
        message.channel.send("Enter a valid term to search for!");
      }
      let term = args.join(" ");
      let response = await fetch(
        `https://images-api.nasa.gov/search?q=${term}`
      );
      let data = await response.json();
      if (!data.collection.items[0].data[0].description) {
        let msg = await message.channel.send(
          `Couldn't find any results for ${term}`
        );
        msg.delete({ timeout: 10000 });
        return message.react("❌");
      }
      let nasasearchembed = new Discord.MessageEmbed()
        .setColor("#00ffbb")
        .setTitle(data.collection.items[0].data[0].title)
        .setDescription(data.collection.items[0].data[0].description)
        .setImage(data.collection.items[0].links[0].href.split(" ").join("%20"))
        .setTimestamp();
      await message.channel.send(nasasearchembed).catch(console.error);
      message.react("✔️");
    }
  });
};

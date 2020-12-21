const Discord = require("discord.js");
module.exports.run = (client, message, args) => {
  message.channel.send("pong!").catch(console.error);
};

const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    const musicCommands = new Discord.MessageEmbed()
        .setColor("#00FF00")
        .addFields(
            {
                name: "List of all music commands",
                value:
                    "`play`,`stop`,`remove`,`skip`,`skipto`,`pause`,`resume`, `queue`,`nowplaying`,`lyrics`,`volume`,`move`",
            },
            {
                name: "Play any song or playlist from Youtube or Soundcloud",
                value: "/play <URL>",
            }
        );

    message.reply(musicCommands).catch(console.err);
};

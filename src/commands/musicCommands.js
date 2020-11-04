const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        const musicCommands = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .addFields(
                {
                    name: "List of all music commands",
                    value:
                        "`play`,`stop`,`remove`,`skip`,`skipto`,`pause`,`resume`, `queue`,`nowplaying`,`lyrics`,`volume`",
                },
                {
                    name:
                        "Play any song or playlist from Youtube or Soundcloud",
                    value: "/play <URL>",
                },
                {
                    name: "Radio Commands",
                    value: "**prefix** - /stream",
                    inline: true,
                },
                {
                    name: "Radio Channels",
                    value: "`kissfm`,`tnlfm`,`goldfm`,`yesfm`,`sunfm`",
                    inline: true,
                },
                { name: "\u200B", value: "\u200B", inline: true }
            )

            .setTimestamp();
        if (message.content === "/music commands") {
            message.reply(musicCommands).catch(console.err);
        }
    });
};

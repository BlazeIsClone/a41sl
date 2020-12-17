const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { PREFIX } = require("../../../config.json");
module.exports = (client) => {
    client.on("message", async (message) => {
        const addRolesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/sTQnkvP.png")
            .setColor("#00FF00");

        if (!message.guild) return;
        if (!message.content.startsWith(PREFIX) || message.author.bot) return;
        let args = message.content.slice(PREFIX.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        if (command === "notificationsembed") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(
                    "You do not have the permissions to do that"
                );

            const addRolesEmbed = new Discord.MessageEmbed()
                .setColor("#00FF00")

                .setDescription(
                    "**React with the corresponding emoji to recieve notifications.**" +
                        "\n" +
                        "\n" +
                        "<:announcements_icon:788964246150709318> • Announcements" +
                        "\n\n" +
                        "<:events:788964246276931584> • Events" +
                        "\n\n" +
                        "<:memes:788964245931819039> • Memes" +
                        "\n\n" +
                        "<:giveaways_icon:788965835855233046>  • Giveaways"
                );

            (async () => {
                await message.channel
                    .send(addRolesAttachment)
                    .catch(console.error);
                try {
                    message.channel.send(addRolesEmbed).catch(console.error);
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    });
};

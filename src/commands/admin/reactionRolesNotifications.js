const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "reactionRolesNotifications",
    aliases: [],
    description: "Sends an embed with a list of notifications",
    async execute(client, message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("You do not have the permissions to do that");

        const addRolesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/sTQnkvP.png")
            .setColor("#00FF00");

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

        message.channel.send(addRolesAttachment).catch(console.error);
        message.channel.send(addRolesEmbed).catch(console.error);
    },
};

const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "reactionRolesIntro",
    description: "sends an embed with reaction roles introduction",
    async execute(message, args) {
        const addRolesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/w442vDB.png")
            .setColor("#00FF00");

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("You do not have the permissions to do that");

        const addRolesEmbed = new Discord.MessageEmbed()
            .setColor("#00FF00")

            .setDescription(
                "**By accepting our community rules and guidelines you are assigned the role**" +
                    "\n" +
                    "<@&696747023772155956>." +
                    " Be active and interact with the community to fight your way through the ranks and become one of the elites." +
                    "\n" +
                    "\n" +
                    "Good luck and have fun!"
            );

        message.channel.send(addRolesAttachment).catch(console.error);
        message.channel.send(addRolesEmbed).catch(console.error);
    },
};

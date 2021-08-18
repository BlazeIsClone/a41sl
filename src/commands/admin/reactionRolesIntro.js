const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { primaryColor } = require("../../../config.json");

module.exports = {
    name: "reactionRolesIntro",
    description: "sends an embed with reaction roles introduction",
    async execute(message, args) {
        const addRolesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/w442vDB.png")
            .setColor(primaryColor);

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("You do not have the permissions to do that");

        const addRolesEmbed = new Discord.MessageEmbed()
            .setColor(primaryColor)

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

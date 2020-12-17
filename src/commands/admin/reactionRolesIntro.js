const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { PREFIX } = require("../../../config.json");
module.exports = (client) => {
    client.on("message", async (message) => {
        const addRolesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/w442vDB.png")
            .setColor("#00FF00");

        if (!message.guild) return;
        if (!message.content.startsWith(PREFIX) || message.author.bot) return;
        let args = message.content.slice(PREFIX.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        if (command === "sudo001") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(
                    "You do not have the permissions to do that"
                );

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

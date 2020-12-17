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
                    "**Select your roles from here to unlock the servers full potential**" +
                        "\n\n" +
                        "You will first take your baby steps as a <@&696747023772155956>" +
                        "\n" +
                        "You can prove your greatness to this community to get rewarded!"
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

const Discord = require("discord.js");

module.exports = {
        name: "linebreak",
        aliases: [],
        description: "Sends an empty message",
        async execute(client, message, args) {
                if (!message.member.hasPermission("ADMINISTRATOR"))
                        return message.reply(
                                "You do not have the permissions to do that"
                        );
                message.channel.send("‎");
        },
};

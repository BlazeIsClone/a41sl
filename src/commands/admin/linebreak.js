const Discord = require("discord.js");

module.exports = {
        name: "linebreak",
        description: "Sends an empty message",
        async execute(message, args) {
                if (!message.member.hasPermission("ADMINISTRATOR"))
                        return message.reply(
                                "You do not have the permissions to do that"
                        );
                message.channel.send("‎");
        },
};

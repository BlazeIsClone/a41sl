const Discord = require("discord.js");

module.exports.run = (client, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(
                        "You do not have the permissions to do that"
                );
        message.channel.send("‎");
};

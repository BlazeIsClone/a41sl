const Discord = require("discord.js");
const addRolesEmbed = new Discord.MessageEmbed()

    .setColor("#0099ff")
    .setTitle(
        "To join or leave a role, react to this message with one of the following emotes."
    )
    .addFields(
        {
            name: "​",
            value: "​"
        },
        {
            name: "💎 • Live Streams Aleart!",
            value: "​"
        },
        {
            name: "💎 • Game Giveaways!",
            value: "​"
        },
        {
            name: "💎 • league of Legends Updates",
            value: "​"
        },
        {
            name: "💎 • Minecraft Updates",
            value: "​"
        },
        {
            name: "💎 • Wired Magazine Subscription",
            value: "​"
        }
    );

module.exports = addRolesEmbed;

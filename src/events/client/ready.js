const Discord = require("discord.js");

module.exports = async (client) => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log("Discord.js API Ready! ⚡");
    client.user.setPresence({
        status: "online",
        activity: {
            name: "/help | 🧃",
            type: "PLAYING",
            details: null,
            url: null,
        },
    });
};

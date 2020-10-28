const Discord = require("discord.js");

module.exports = (client) => {
    client.once("ready", async () => {
        console.log(`Logged in as ${client.user.username}!`);
        console.log("Ready! ⚡");
        client.user.setPresence({
            status: "online",
            activity: {
                name: "/help 🍜",
                type: "PLAYING",
                details: null,
                url: null,
            },
        });
    });
};

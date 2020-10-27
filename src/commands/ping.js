const Discord = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.content === "/ping") {
            const msg = await message.channel.send("Ping?");
            msg.edit(
                `:ping_pong: Latency is \`${
                    msg.createdTimestamp - message.createdTimestamp
                }ms\``
            );
        }
    });
};

const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: [],
    description: "Pings the server",
    async execute(client, message, args) {
        const msg = await message.channel.send("Ping?");
        msg.edit(
            `:ping_pong: **Pong!** Took \`${
                msg.createdTimestamp - message.createdTimestamp
            }ms\``
        );
    },
};

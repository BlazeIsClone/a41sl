module.exports = {
    name: "ping",
    description: "Pings the server",
    async execute(message) {
        const messageObj = await message.channel.send({ content: "Ping?" });
        messageObj.edit({
            content: `:ping_pong: **Pong!** Took \`${messageObj.createdTimestamp - message.createdTimestamp}ms\``
        });
    },
};

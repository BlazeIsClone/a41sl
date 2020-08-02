const discord = require("discord.js");

const client = new discord.Client();

const token = "NzM5MzM5MDcyOTkyMTgyMzE0.XyZBKw.2Rs9x2fuKEPkQ9e8aSBRX5hj4_E";

client.on("ready", () => {
    console.log("Blaze Bot Is Online");
});
client.on("message", msg => {
    if (msg.content == "hi") {
        msg.reply("bb i luv u");
    }
});
client.on("message", async message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;
    //
    if (message.content === "/waren") {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('http://198.178.123.8:8404/;', {
              volume: 0.5,
            });
        } else {
            message.reply("no");
        }
    }
});
client.login(token);

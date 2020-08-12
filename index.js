const discord = require("discord.js");
const client = new discord.Client();
const token = process.env.token;
client.login(token);
var dispatcher;

//Bot Boot
client.on("ready", () => {
    console.log("A41SL Bot Is Online");
});

// Help Command
client.on("message", msg => {
    if (msg.content == "/help") {
        msg.reply("type - /waren");
    }
});

//Bot Join Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/waren") {
        if (message.member.voice.channel) {
            var connection = await message.member.voice.channel.join();
            dispatcher = connection.play("http://198.178.123.8:8404/;");
        }
    }
});

//Bot Leave Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/palayan") {
        if (message.member.voice.channel) {
            var connection = await message.member.voice.channel.leave();
        }
    }
});

// User Welcome Message
client.on("guildMemberAdd", member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(
        ch => ch.name === "welcome"
    );
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}. Have Fun and stay awsome!`);
});

//TTS Message
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/hi wifu") {
        message.reply("hello how are you doing", { tts: true });
    }
});

const srcOne = "http://198.178.123.8:8404/;";
const srcTwo = "http://live.tnlrn.com:8010/live.mp3";
const srcThree = "http://209.133.216.3:7048/;";
const srcFour = "http://209.133.216.3:7058/;stream.mp3";

//Radio Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/sunfm dapn") {
        if (message.member.voice.channel) {
            var connection = await message.member.voice.channel.join();
            dispatcher = connection.play("http://live.tnlrn.com:8010/live.mp3");
        }
    }
});

//Radio Stop Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/stop") {
        if (message.member.voice.channel) {
            dispatcher = null;
        }
    }
});

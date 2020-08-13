const discord = require("discord.js");
const client = new discord.Client();
const token = process.env.token;
client.login(token);
var dispatcher;
var connection;

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
            connection = await message.member.voice.channel.join();
        }
    }
});

//Bot Leave Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/palayan") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.leave();
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

const kissRadio = "http://198.178.123.8:8404/;";
const tnlrocksRadio = "http://live.tnlrn.com:8010/live.mp3";
const goldRadio = "http://209.133.216.3:7048/;";
const sunRadio = "http://209.133.216.3:7058/;stream.mp3";

//Radio Command
client.on("message", async message => {
    if (!message.guild) return message.reply('You have to be in a voice channel to play music');
    if (message.content === "/sunfm dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(sunRadio);
            console.log("playing sun");
        } else if (message.content === "/kissfm dapn") {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(kissRadio);
            console.log("playing kiss");
        } else if (message.content === "/goldfm dapn") {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(goldRadio);
            console.log("playing gold");
        } else if (message.content === "/tnl dapn") {
            dispatcher = connection.play(tnlrocksRadio);
            connection = await message.member.voice.channel.join();
            console.log("playing tnl");
        }
    }
});

//Radio Stop Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/stop karapn") {
        if (message.member.voice.channel) {
            dispatcher = connection.pause();
            console.log("audio paused");
        }
    }
});

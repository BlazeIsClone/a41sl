const discord = require("discord.js");
const client = new discord.Client();
const token = process.env.token;
const rules = require("./rules.js");
client.login(token);
var dispatcher;
var connection;

//Bot Boot
client.on("ready", () => {
    console.log("A41SL Bot Is Online");
});

// Help Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/rules") {
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: "Hi, Welcome to All for one SL!",
                    icon_url: "https://i.imgur.com/wSTFkRM.png"
                },
                title: rules.title,
                url: "http://google.com",
                description: rules.bodyRules,
                thumbnail: {
                    url: "https://i.imgur.com/wSTFkRM.png"
                },
                timestamp: new Date(),
                footer: {
                    icon_url: "https://i.imgur.com/wSTFkRM.png",
                    text: "Team A41SL"
                }
            }
        });
    }
});

const attachment = new discord.MessageAttachment(
    "https://i.imgur.com/w3duR07.png"
);
//Bot Join Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/waren") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
        } else {
            message.reply("You have to be in a voice channel to play music");
        }
    }
});

//Bot Leave Command
client.on("message", async message => {
    if (message.content === "/palayan") {
        if (message.member.voice.channel) {
            connection = message.member.voice.channel.leave();
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
    if (!message.guild) return;
    if (message.content === "/sun dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(sunRadio);
            console.log("playing sun");
        }
    }
});

//Radio Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/kiss dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(kissRadio);
            console.log("playing sun");
        }
    }
});

//Radio Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/gold dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(goldRadio);
            console.log("playing gold");
        }
    }
});

//Radio Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/tnl dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(tnlrocksRadio);
            console.log("playing tnl");
        }
    }
});

//Radio Stop Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/stop karapn") {
        if (message.member.voice.channel) {
            dispatcher = connection.stop();
            console.log("audio paused");
        }
    }
});

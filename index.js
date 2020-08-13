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
    if (msg.content == "/udaw") {
        channel.send(exampleEmbed);
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
    if (!message.guild)
        return message.reply("You have to be in a voice channel to play music");
    if (message.content === "/sunfm dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(sunRadio);
            console.log("playing sun");
        }
    }
});

//Radio Command
client.on("message", async message => {
    if (!message.guild)
        return message.reply("You have to be in a voice channel to play music");
    if (message.content === "/kissfm dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(kissRadio);
            console.log("playing sun");
        }
    }
});

//Radio Command
client.on("message", async message => {
    if (!message.guild)
        return message.reply("You have to be in a voice channel to play music");
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
    if (!message.guild)
        return message.reply("You have to be in a voice channel to play music");
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

const exampleEmbed = {
    color: 0x0099ff,
    title: "Some title",
    url: "https://discord.js.org",
    author: {
        name: "Some name",
        icon_url: "https://i.imgur.com/wSTFkRM.png",
        url: "https://discord.js.org"
    },
    description: "Some description here",
    thumbnail: {
        url: "https://i.imgur.com/wSTFkRM.png"
    },
    fields: [
        {
            name: "Regular field title",
            value: "Some value here"
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: false
        },
        {
            name: "Inline field title",
            value: "Some value here",
            inline: true
        },
        {
            name: "Inline field title",
            value: "Some value here",
            inline: true
        },
        {
            name: "Inline field title",
            value: "Some value here",
            inline: true
        }
    ],
    image: {
        url: "https://i.imgur.com/wSTFkRM.png"
    },
    timestamp: new Date(),
    footer: {
        text: "Some footer text here",
        icon_url: "https://i.imgur.com/wSTFkRM.png"
    }
};

const discord = require("discord.js");
const client = new discord.Client();
const token = process.env.token;
const rules = require("./rules.js");
const ytdl = require("ytdl-core");
const prefix = "$";
var dispatcher;
var connection;
var serverQueue;
//Bot status

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

// Help Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/rules") {
        message.author.send({
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

//Music Commands
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
});

//Music Permissions
const queue = new Map();

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need permission to join and speak in you voice channel!"
        );
    }
}

//Getting Audio With YTDL
(async () => {
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };
})();

//Creating The Contract For The Queue
if (!serverQueue) {
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
    };

    //Setting The Queue Using Our Contract
    queue.set(message.guild.id, queueContruct);
    //Pushing The Songs To The Songs Array queueContruct.songs.push(song);

    try {
        //Here We Try To Join The Voice Chat And Save Our Connection Into Obj
        (async () => {
            connection = await voiceChannel.join();
        })();

        //Calling The Play Function To Start A Song
        play(message.guild, queueContruct.songs[0]);
    } catch (err) {
        //Printing The ERR Message If The Bot Fails To Join
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }
} else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send("${song.titile} has been added to the queue!");
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


client.login(token);

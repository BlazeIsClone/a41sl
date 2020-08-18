const Discord = require("discord.js");
const { prefix } = require("./config.json");
const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.token;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./rules.js");
const client = new Discord.Client();
var events = require('events').EventEmitter.defaultMaxListeners = 15;
var dispatcher;
var connection;

//Bot status
client.once("ready", () => {
    console.log("Ready!");
    client.user.setPresence({
        status: "online",
        activity: {
            name: "with SnowV 🎮",
            type: "STREAMING",
            details: "Watching Snowv",
            url: "https://www.twitch.tv/snowv_streams"
        }
    });
});

client.on("message", function (message) {
    if (message.content === "!Live") {
        fetch("https://api.twitch.tv/kraken/streams/l49jb5v13c6fvssi55ilnh9qes51t7", function (
            err,
            res
        ) {
            if (res.stream == null) {
                //mybot.reply(message, "currently not live");
                console.log('currently not live')
            } else {
                //mybot.reply(message, "currently live");
                console.log('currently live')
            }
        });
    }
});

const queue = new Map();

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

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
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
    }
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
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(
        `Start playing :arrow_forward: : **${song.title}**`
    );
}

// Help Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/rules") {
        message.author.send(rulesEmbed);
    }
});

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
client.on("guildMemberAdd", async member => {
    const channel = member.guild.channels.cache.find(
        ch => ch.name === "welcome"
    );

    if (!channel) return;
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./wallpaper.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#0800ff";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
        "Welcome to the server,",
        canvas.width / 2.5,
        canvas.height / 3.5
    );
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext("2d");

        let fontSize = 70;

        do {
            // Assign the font to the context and decrement it so it can be measured again
            ctx.font = `${(fontSize -= 10)}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (ctx.measureText(text).width > canvas.width - 300);

        // Return the result to use in the actual canvas
        return ctx.font;
    };

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
        `${member.displayName}!`,
        canvas.width / 2.5,
        canvas.height / 1.8
    );

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({ format: "jpg" })
    );
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.lineWidth = 13;
    ctx.strokeStyle = "white";
    ctx.stroke();

    const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
    );
    channel.send(`Hey Welcome to All For One SL, ${member}!`, attachment);
});

client.on("guildMemberRemove", member => {
    const channelGoodBye = member.guild.channels.cache.find(
        ch => ch.name === "goodbye"
    );
    if (!channelGoodBye) return;

    const goodbyeEmbed = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setImage(member.user.displayAvatarURL({ format: "jpg" }))
        .setTitle("It's a goodbye! :ringed_planet:")
        .setDescription(`**${member.displayName}** has left for adventure .`)
        .setTimestamp();

    channelGoodBye.send(goodbyeEmbed);
});

const kissRadio = "http://198.178.123.8:8404/;";
const tnlrocksRadio = "http://live.tnlrn.com:8010/live.mp3";
const goldRadio = "http://209.133.216.3:7048/;";
const sunRadio = "http://209.133.216.3:7058/;stream.mp3";
const yesRadio = "http://live.trusl.com:1150/;";

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

//Radio Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/yes dapn") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(yesRadio);
            console.log("playing tnl");
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/stop karapn") {
        dispatcher = connection.end();
        console.log("dispatcher stoped");
    }
});
client.login(token);

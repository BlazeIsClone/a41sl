const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const TOKEN = process.env.TOKEN;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./commands/rules.js");
const client = new Discord.Client();
var events = (require("events").EventEmitter.defaultMaxListeners = 15);
const memberCount = require("./commands/member-count");
const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX, STREAM } = require("./config.json");
var dispatcher, connection;

const fs = require("fs");
const firebase = require("./config");
const moment = require("moment");
const setting = require("./setting.json");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const ngrok = require("ngrok");
var express = require("express");
var localtunnel = require("localtunnel");
var global = require("./global");

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.username}!`);
    memberCount(client);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "Setting Up Stream",
            type: "STREAMING",
            details: "Watching Snowv",
            url: "https://www.twitch.tv/snowv_streams"
        }
    });
});

// Rules Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/rules") {
        message.author.send(rulesEmbed);
    }
});

//Bot Join Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/join") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
        } else {
            message.reply("You have to be in a voice channel to play music");
        }
    }
});

//Bot Leave Command
client.on("message", async message => {
    if (message.content === "/leave") {
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
    const guild = client.guilds.cache.get("463027132243771403");
    var getmemberCount = guild.memberCount;
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
        `Member #${getmemberCount}`,
        canvas.width / 2.5,
        canvas.height / 1.45
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
    channel.send(`Hey Welcome to **All For One SL**, ${member}!`, attachment);
});

client.on("guildMemberRemove", member => {
    const channelGoodBye = member.guild.channels.cache.find(
        ch => ch.name === "goodbye"
    );
    if (!channelGoodBye) return;
    const goodbyeEmbed = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setImage(member.user.displayAvatarURL({ format: "jpg" }))
        .setTitle("✨ It's a goodbye!")
        .setDescription(`**${member.displayName}** has left for adventure .`)
        .setTimestamp();

    channelGoodBye.send(goodbyeEmbed);
});

const kissRadio = "http://198.178.123.8:8404/;";
const tnlrocksRadio = "http://live.tnlrn.com:8010/live.mp3";
const goldRadio = "http://209.133.216.3:7048/;";
const sunRadio = "http://209.133.216.3:7058/;stream.mp3";
const yesRadio = "http://live.trusl.com:1150/;";

//Radio Commands
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} sunfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(sunRadio);
            console.log("playing sun");
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} kissfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(kissRadio);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} goldfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(goldRadio);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} tnlfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(tnlrocksRadio);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} yesfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(yesRadio);
        }
    }
});
var queue = require("./commands/play.js");
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/stop") {
        dispatcher.end();
        queue.songs = [];
        console.log("dispatcher stoped");
    }
});

client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("warn", info => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file =>
    file.endsWith(".js")
);
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `please wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${
                    command.name
                }\` command.`
            );
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message
            .reply("There was an error executing that command.")
            .catch(console.error);
    }
});

// This is the best way to define args. Trust me.
client.on("message", message => {
    const args = message.content
        .slice(setting.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();
});
client.on("add", data => {
    console.log(data);
    addSong(data);
});

client.on("volume", data => {
    volume(data);
});

client.on("play", data => {
    if (global.dispatcher !== null) {
        global.dispatcher = null;
    }
    play(data);
    console.log("client on play dispatcher: " + global.dispatcher);
});

client.on("skip", () => {
    skip();
});

client.on("pause", () => {
    pause();
});

client.on("resume", () => {
    resume();
});

var next = 0;
play = index => {
    if (global.voiceChannel !== null) {
        global.Client.emit("voiceChannel", true);
        console.log("title: " + global.playlist[index].title);
        let stream = ytdl(global.playlist[index].url, {
            audioonly: true
        });
        global.dispatcher = global.connection.playStream(stream);
        global.message.channel.send(
            "```fix" +
                "\n" +
                "[Now Playing]: " +
                global.playlist[index].title +
                "```"
        );
        global.dispatcher.on("end", () => {
            if (global.dispatcher !== null) {
                next = index + 1;
                if (index >= global.playlist.length - 1) {
                    console.log("end playlist");
                    global.Client.emit("endPlaylist");
                    return;
                } else {
                    play(next);
                    global.Client.emit("autoNext", next);
                }
            }
        });
    } else {
        global.Client.emit("voiceChannel", false);
        console.log("No connection in voiceChannel");
    }
};

skip = () => {
    console.log("skip");
    if (global.dispatcher !== null) {
        console.log("end");
        global.dispatcher.end();
    } else {
        console.log("null");
    }
};

pause = () => {
    if (global.dispatcher !== null) {
        console.log("pause");
        global.dispatcher.pause();
    }
};

resume = () => {
    if (global.dispatcher !== null) {
        console.log("resume");
        global.dispatcher.resume();
    }
};

volume = data => {
    if (global.dispatcher !== null) {
        console.log("dispatcher volume: " + global.dispatcher.volume);
        global.dispatcher.setVolume(data / 100);
        console.log("After set: " + global.dispatcher.volume);
    }
};

client.login(setting, TOKEN);

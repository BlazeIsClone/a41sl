require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageEmbed, MessageAttachment, Collection } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.DISCORD_TOKEN;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./src/commands/rules.js");
const helpEmbed = require("./src/commands/help.js");
const addRolesEmbed = require("./src/commands/add-roles");
var events = (require("events").EventEmitter.defaultMaxListeners = 20);
const memberCount = require("./src/commands/member-count");
const { readdirSync } = require("fs");
const { join } = require("path");
const STREAM = process.env.STREAM_PREFIX;
const { PREFIX } = require("./config.json");
var global = require("./global");
var bot = new Discord.Client();
const config = require("./src/database/roles-reaction-db.json");
var load = require("./src/events/load.js");
var track = require("./src/events/track.js");
load(client, config);
track(client, config);
var queue = require("./src/commands/music/play.js");
const nsfwConfig = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const statsEmbed = require("./src/commands/stats");
const musicChannel = process.env.MUSIC_CHANNEL;
const mongoose = require("mongoose");
const {
    sunRadio,
    kissRadio,
    tnlrocksRadio,
    goldRadio,
    yesRadio,
} = require("./config.json");
var os = require("os");
moment.locale("fr");

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log("Ready! ⚡");
    memberCount(client);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "/help 🍜",
            type: "PLAYING",
            details: null,
            url: null,
        },
    });
});

client.on("message", async (message) => {
    if (!message.guild) return;
    if (message.content === "/ping") {
        const msg = await message.channel.send("Ping?");
        msg.edit(
            `Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.`
        );
    }

    const helpAttachment = new MessageAttachment(
        "https://i.imgur.com/790FtQS.png"
    );

    if (message.content === "/help") {
        message.author.send(helpEmbed).catch(console.error);
        message.author.send(helpAttachment).catch(console.error);
    }

    const rulesAttachment = new MessageAttachment(
        "https://i.imgur.com/790FtQS.png"
    );
    if (message.content === "/rules") {
        message.author.send(rulesEmbed).catch(console.error);
        message.author.send(rulesAttachment).catch(console.error);
    }
    if (message.content === "/join") {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
        } else {
            message.reply("You have to be in a voice channel to play music");
        }
    }
    if (message.content === "/leave") {
        if (message.member.voice.channel) {
            connection = message.member.voice.channel.leave();
        }
    }
    if (message.content === "/server info") {
        message.reply(statsEmbed);
    }
    if (message.content === "/stop") {
        dispatcher.end();
        connection = message.member.voice.channel.leave();
        queue.songs = [];
    }
});

// Add-Roles Sudo Command
//const addRolesAttachment = new MessageAttachment("https://i.imgur.com/790FtQS.png");

client.on("message", async (message) => {
    if (!message.guild) return;
    if (message.content === "/sudo rolesEmbed") {
        message.channel.send(addRolesEmbed).catch(console.error);
        //message.author.send(addRolesAttachment).catch(console.error);
    }
});

// User Welcome Message
client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "welcome"
    );

    if (!channel) return;
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./src/img/wallpaper.png");
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
    const greetings = [
        "Hey Welcome to **All For One SL**!",
        "Welcome to **All For One SL** enjoy your stay!",
        "Hello there welcome to **All For One SL**!",
        "Welcome to **All For One SL** make yourself at home!",
        "Greetings to **All For One SL** make yourself comfy!",
    ];
    const greet = () => greetings[Math.floor(Math.random() * greetings.length)];
    channel.send(`${greet()}, ${member}`, attachment);
});

//GoodBye Command
const goodbyes = [
    "The magic thing about home is that it feels good to leave, and it feels even better to come back.",
    "Goodbyes are not forever, it simply means we'll miss you until we meet again",
    "It’s time to say goodbye, but I think goodbyes are sad and I’d much rather say hello. Hello to a new adventure.",
    "I can’t remember all the times I told myself to hold on to these moments as they pass",
    "Our memories of yesterday will last a lifetime. We’ll take the best, forget the rest, and someday will find that these are the best of times.",
    "Saying goodbye is the hardest solution of any problem. But sometimes it’s the only choice we have…",
    "It’s not the days in life we remember, rather the moments.",
];

client.on("guildMemberRemove", (member) => {
    const channelGoodBye = member.guild.channels.cache.find(
        (ch) => ch.name === "goodbye"
    );
    if (!channelGoodBye) return;
    const goodbye = () => goodbyes[Math.floor(Math.random() * goodbyes.length)];
    const goodbyeEmbed = new Discord.MessageEmbed()
        .setColor("#00FF00")
        .setThumbnail(member.user.displayAvatarURL({ format: "jpg" }))
        .setTitle(`** ${member.displayName} it's time to say goodbye**`)
        .setDescription(`${goodbye()}`)
        .setTimestamp();

    channelGoodBye.send(goodbyeEmbed);
});

//Radio Commands
client.on("message", async (message) => {
    const streamNotInChannel = () => {
        const { channel } = message.member.voice;
        if (!channel) {
            return message
                .reply("You need to join a voice channel first!")
                .catch(console.error);
        }
    };

    const filter = (reaction, user) => {
        return (
            ["⏹"].includes(reaction.emoji.name) && user.id === message.author.id
        );
    };
    if (!message.guild) return;
    if (message.author.bot) return;
    if (
        message.content.includes(`${STREAM}`) &&
        message.channel.id != musicChannel
    ) {
        return message.reply(
            "⛔ Music commands are only available in add-music channel"
        );
    }

    if (message.content === `${STREAM} sunfm`) {
        streamNotInChannel();
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(sunRadio);
            let sunEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Sun Fm**")
                .setThumbnail(
                    "https://lh3.googleusercontent.com/qxVfvXii_pVa5QepZyozdijGPxuSQ957nISY9t9M8DSddQ0JZha2PoopVeiKw5sU0Q4"
                )
                .setDescription(":red_circle: Streaming Live 24/7");
            message.channel.send(sunEmbed).then((sunEmbed) => {
                sunEmbed.react("⏹");
                sunEmbed
                    .awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === "⏹") {
                            message.reply("⏹ Stoped the stream");
                            dispatcher.end();
                            connection = message.member.voice.channel.leave();
                            sunEmbed.reactions.removeAll().catch(console.error);
                        }
                    })
                    .catch(console.error);
            });
        }
    } else if (message.content === `${STREAM} yesfm`) {
        streamNotInChannel();
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(yesRadio);
            let yesEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Yes Fm**")
                .setThumbnail(
                    "https://cdn-profiles.tunein.com/s14405/images/logog.png"
                )
                .setDescription(":red_circle: Streaming Live 24/7");
            message.channel.send(yesEmbed).then((yesEmbed) => {
                yesEmbed.react("⏹");
                yesEmbed
                    .awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === "⏹") {
                            message.reply("⏹ Stoped the stream");
                            dispatcher.end();
                            connection = message.member.voice.channel.leave();
                            yesEmbed.reactions.removeAll().catch(console.error);
                        }
                    })

                    .catch(console.error);
            });
        }
    } else if (message.content === `${STREAM} kissfm`) {
        streamNotInChannel();
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(kissRadio);
            let kissEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Kiss Fm**")
                .setThumbnail(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/KissFMSriLankaLogo2012.png/220px-KissFMSriLankaLogo2012.png"
                )
                .setDescription(":red_circle: Streaming Live 24/7");
            message.channel.send(kissEmbed).then((kissEmbed) => {
                kissEmbed.react("⏹");
                kissEmbed
                    .awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === "⏹") {
                            message.reply("⏹ Stoped the stream");
                            dispatcher.end();
                            connection = message.member.voice.channel.leave();
                            kissEmbed.reactions
                                .removeAll()
                                .catch(console.error);
                        }
                    })
                    .catch(console.error);
            });
        }
    } else if (message.content === `${STREAM} tnlfm`) {
        streamNotInChannel();
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(tnlrocksRadio);
            let tnlEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming TNL Fm**")
                .setThumbnail(
                    "https://cdn-profiles.tunein.com/s14406/images/logog.png"
                )
                .setDescription(":red_circle: Streaming Live 24/7");
            message.channel.send(tnlEmbed).then((tnlEmbed) => {
                tnlEmbed.react("⏹");

                tnlEmbed
                    .awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === "⏹") {
                            message.reply("⏹ Stoped the stream");
                            dispatcher.end();
                            connection = message.member.voice.channel.leave();
                            tnlEmbed.reactions.removeAll().catch(console.error);
                        }
                    })
                    .catch(console.error);
            });
        }
    } else if (message.content === `${STREAM} goldfm`) {
        streamNotInChannel();
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(goldRadio);
            let goldEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Gold Fm**")
                .setThumbnail(
                    "https://mytuner.global.ssl.fastly.net/media/tvos_radios/XAryWL2prn.jpeg"
                )
                .setDescription(":red_circle: Streaming Live 24/7");
            message.channel.send(goldEmbed).then((goldEmbed) => {
                goldEmbed.react("⏹");

                goldEmbed
                    .awaitReactions(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === "⏹") {
                            message.reply("⏹ Stoped the stream");
                            dispatcher.end();
                            connection = message.member.voice.channel.leave();
                            goldEmbed.reactions
                                .removeAll()
                                .catch(console.error);
                        }
                    })
                    .catch(console.error);
            });
        }
    }
});

client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(
    join(__dirname, "src/commands/music/")
).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "src/commands/music/", `${file}`));
    client.commands.set(command.name, command);
}

client.on("message", async (message) => {
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
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
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
    } catch (e) {
        console.log(e);
    }
});
//NSFW COMMANDS
client.config = nsfwConfig;
client.on("message", function (message) {
    if (message.author.bot) return;
    if (message.content.indexOf(nsfwConfig.prefix) !== 0) return;
    const args = message.content
        .slice(nsfwConfig.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
});

fs.readdir("./src/commands/nsfw/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./src/commands/nsfw/${file}`);
        let commandName = file.split(".")[0];
        // console.log(`Load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

fs.readdir("./src/commands/nsfw/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./src/commands/nsfw/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});

client.login(token);

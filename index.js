require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageEmbed, MessageAttachment, Collection } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.DISCORD_TOKEN;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./commands/rules.js");
const helpEmbed = require("./commands/help.js");
const addRolesEmbed = require("./commands/add-roles");
var events = (require("events").EventEmitter.defaultMaxListeners = 20);
const memberCount = require("./commands/member-count");
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX } = require("./config.json");
var global = require("./global");
var bot = new Discord.Client();
const config = require("./include/roles-reaction-db.json");
var load = require("./src/load");
var track = require("./src/track");
load(client, config);
track(client, config);
var queue = require("./commands/play.js");
const nsfwConfig = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const statsEmbed = require("./commands/stats");
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

client.once("reconnecting", () => {
    console.log("Reconnecting! 🚧");
});

client.once("disconnect", () => {
    console.log("Disconnect! 🚩");
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
    if (message.content === "/system info") {
        message.reply(statsEmbed);
    }
    if (message.content === "/stop") {
        dispatcher.end();
        connection = message.member.voice.channel.leave();
        queue.songs = [];
        console.log("dispatcher stoped");
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
    channel.send(`Hey Welcome to **All For One SL**, ${member}!`, attachment);
});

//GoodBye Command
client.on("guildMemberRemove", (member) => {
    const channelGoodBye = member.guild.channels.cache.find(
        (ch) => ch.name === "goodbye"
    );
    if (!channelGoodBye) return;
    const goodbyeEmbed = new Discord.MessageEmbed()
        .setColor("#00FF00")
        .setThumbnail(member.user.displayAvatarURL({ format: "jpg" }))
        .setTitle(
            `:ringed_planet: ** ${member.displayName} Has Left For Adventure**`
        )
        .setDescription(
            "The magic thing about home is that it feels good to leave, and it feels even better to come back."
        )
        .setTimestamp();

    channelGoodBye.send(goodbyeEmbed);
});

client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
    file.endsWith(".js")
);
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
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

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        // console.log(`Load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});

client.login(token);

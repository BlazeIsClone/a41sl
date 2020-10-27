require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageEmbed, MessageAttachment, Collection } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.DISCORD_TOKEN;
const ytdl = require("ytdl-core");
const helpEmbed = require("./src/commands/help.js");
const addRolesEmbed = require("./src/commands/add-roles");
var events = (require("events").EventEmitter.defaultMaxListeners = 20);
const memberCount = require("./src/commands/member-count");
const { readdirSync } = require("fs");
const { join } = require("path");
const STREAM = process.env.STREAM_PREFIX;
var { PREFIX } = require("./config.json");
var global = require("./global");
var bot = new Discord.Client();
const config = require("./src/database/roles-reaction.json");
const nsfwConfig = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const musicChannel = process.env.MUSIC_CHANNEL;
moment.locale("fr");
const load = require("./src/listeners/load.js");
const track = require("./src/listeners/track.js");
const google = require("./src/commands/misc/google");
const eval = require("./src/commands/dev/eval");
const ping = require("./src/commands/ping");
const queue = require("./src/commands/music/play.js");
const help = require("./src/commands/help");
const serverInfo = require("./src/commands/serverInfo");
const rules = require("./src/commands/rules");
const leaveVoice = require("./src/commands/leave");
const joinVoice = require("./src/commands/join");
const welcome = require("./src/listeners/welcome");
const goodbye = require("./src/listeners/goodbye");
const streamCommands = require("./src/commands/stream/streamCommands");

load(client, config);
track(client, config);
google(client);
eval(client);
ping(client);
help(client);
serverInfo(client);
rules(client);
leaveVoice(client);
joinVoice(client);
welcome(client);
goodbye(client);
streamCommands(client);

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

// Add-Roles Sudo Command
//const addRolesAttachment = new MessageAttachment("https://i.imgur.com/790FtQS.png");

client.on("message", async (message) => {
    if (!message.guild) return;
    if (message.content === "/sudo rolesEmbed") {
        message.channel.send(addRolesEmbed).catch(console.error);
        //message.author.send(addRolesAttachment).catch(console.error);
    }
});

//music commands
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(
    join(__dirname, "./src/commands/music/")
).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(
        __dirname,
        "./src/commands/music/",
        `${file}`
    ));
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
        if (typeof command.execute === "function") {
            command.execute(message, args);
        }
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
fs.readdir(`./src/listeners/`, (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        let eventFunction = require(`./src/listeners/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});
client.login(token);

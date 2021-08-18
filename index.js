require("dotenv").config();
const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const client = new Client({
    disableMentions: "everyone",
    restTimeOffset: 0,
});
const events = (require("events").EventEmitter.defaultMaxListeners = 70);
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX } = require("./config.json");
const config = require("./config.json");
const fs = require("fs");
var path = require("path");

client.config = config;
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---------- IMPORT ALL COMMANDS ---------- */
var walk = (dir, done) => {
    var results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

walk("./src/commands/", (err, results) => {
    if (err) throw err;
    for (const file of results) {
        const cmdFileName = require(`${file}`);
        client.commands.set(cmdFileName.name, cmdFileName);
    }
});

/* ---------- IMPORT ALL EVENTS ---------- */
var reactionRolesDb = require("./src/database/roles-reaction.json");
const fetchMessages = require("./src/events/reaction_roles/load");
fetchMessages(client, reactionRolesDb);
const track = require("./src/events/reaction_roles/track");
track(client, reactionRolesDb);

fs.readdir("./src/events/client/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./src/events/client/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});
fs.readdir("./src/events/guild/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./src/events/guild/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

/* ---------- COMMAND HANDLER CONFIGURATION ---------- */
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
    } catch (error) {
        console.error(error);
        message
            .reply("There was an error executing that command.")
            .catch(console.error);
    }
});

/* ---------- DEBUGING ---------- */
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN);

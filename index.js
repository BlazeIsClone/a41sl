const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const client = new Client({
    disableMentions: "everyone",
    restTimeOffset: 0,
});
const events = (require("events").EventEmitter.defaultMaxListeners = 50);
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX } = require("./config.json");
const config = require("./config.json");
const fs = require("fs");
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;

client.config = config;
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---------- TESTCODE(unstable) ---------- */
const { Slash } = require("discord-slash-commands");
const slash = new Slash(client);
client.on("ready", () => {
    slash.command({
        guildOnly: true,
        guildID: "463027132243771403",
        data: {
            name: "command",
            description: "command description",
            type: 4,
            content: `command content`,
        },
    });
});

/* ---------- DEBUGING ---------- */

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/* ---------- IMPORT ALL COMMANDS ---------- */
const adminCmds = fs
    .readdirSync("./src/commands/admin")
    .filter((file) => file.endsWith(".js"));

for (const file of adminCmds) {
    const adminCommands = require(`./src/commands/admin/${file}`);
    client.commands.set(adminCommands.name, adminCommands);
}
const devCmds = fs
    .readdirSync("./src/commands/dev")
    .filter((file) => file.endsWith(".js"));

for (const file of devCmds) {
    const devCommands = require(`./src/commands/dev/${file}`);
    client.commands.set(devCommands.name, devCommands);
}
const funCmds = fs
    .readdirSync("./src/commands/fun")
    .filter((file) => file.endsWith(".js"));

for (const file of funCmds) {
    const funCommands = require(`./src/commands/fun/${file}`);
    client.commands.set(funCommands.name, funCommands);
}
const generalCmds = fs
    .readdirSync("./src/commands/general")
    .filter((file) => file.endsWith(".js"));

for (const file of generalCmds) {
    const generalCommands = require(`./src/commands/general/${file}`);
    client.commands.set(generalCommands.name, generalCommands);
}
const miscCmds = fs
    .readdirSync("./src/commands/misc")
    .filter((file) => file.endsWith(".js"));

for (const file of miscCmds) {
    const miscCommands = require(`./src/commands/misc/${file}`);
    client.commands.set(miscCommands.name, miscCommands);
}
const musicCmds = fs
    .readdirSync("./src/commands/music")
    .filter((file) => file.endsWith(".js"));

for (const file of musicCmds) {
    const musicCommands = require(`./src/commands/music/${file}`);
    client.commands.set(musicCommands.name, musicCommands);
}
const nsfwCmds = fs
    .readdirSync("./src/commands/nsfw")
    .filter((file) => file.endsWith(".js"));

for (const file of nsfwCmds) {
    const nsfwCommands = require(`./src/commands/nsfw/${file}`);
    client.commands.set(nsfwCommands.name, nsfwCommands);
}

/* ---------- IMPORT ALL EVENTS ---------- */

var reactionRolesDb = require("./src/database/roles-reaction.json");

const fetchMessages = require("./src/reaction_roles/load");
fetchMessages(client, reactionRolesDb);

const track = require("./src/reaction_roles/track");
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
/* ---------- COMMAND HANDLER ---------- */
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

client.login(TOKEN);

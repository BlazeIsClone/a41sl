const Discord = require("discord.js");
const client = new Discord.Client();
const { Collection } = require("discord.js");
const events = (require("events").EventEmitter.defaultMaxListeners = 50);
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX } = require("./config.json");
const config = require("./src/database/roles-reaction.json");
const nsfwConfig = require("./config.json");
const fs = require("fs");
const moment = require("moment");
moment.locale("fr");
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;

const load = require("./src/listeners/load.js");
const track = require("./src/listeners/track.js");
const image = require("./src/commands/misc/image");
const eval = require("./src/commands/dev/eval");
const ping = require("./src/commands/ping");
const queue = require("./src/commands/music/play.js");
const help = require("./src/commands/help");
const serverInfo = require("./src/commands/serverInfo");
const rules = require("./src/commands/rules");
const leaveVoice = require("./src/commands/leave");
const joinVoice = require("./src/commands/join");
const statusPresence = require("./src/listeners/statusPresence");
const memberCount = require("./src/listeners/member-count");
const reactionRoles = require("./src/commands/admin/reactionRoles");
const musicCommands = require("./src/commands/musicCommands");
const memes = require("./src/commands/memes/memes");
const announcementsWebhook = require("./src/webhooks/Announcements");
const bulkDelete = require("./src/commands/admin/bulkDelete");
const nasa = require("./src/commands/misc/nasa");
const restart = require("./src/commands/admin/restart");

const guildMemberAdd = require("./src/events/guild/guildMemberAdd");
const guildMemberRemove = require("./src/events/guild/guildMemberRemove");
const channelCreate = require("./src/events/guild/channelCreate");
const channelDelete = require("./src/events/guild/channelDelete");
const channelUpdate = require("./src/events/guild/channelUpdate");
const guildBanAdd = require("./src/events/guild/guildBanAdd");
const guildBanRemove = require("./src/events/guild/guildBanRemove");
const guildMemberUpdate = require("./src/events/guild/guildMemberUpdate");
const message = require("./src/events/guild/message");
const messageDelete = require("./src/events/guild/messageDelete");
const messageUpdate = require("./src/events/guild/messageUpdate");
const roleCreate = require("./src/events/guild/roleCreate");
const roleDelete = require("./src/events/guild/roleDelete");
const roleUpdate = require("./src/events/guild/roleUpdate");

load(client, config);
track(client, config);
image(client);
eval(client);
ping(client);
help(client);
serverInfo(client);
rules(client);
leaveVoice(client);
joinVoice(client);
statusPresence(client);
memberCount(client);
reactionRoles(client);
musicCommands(client);
memes(client);
announcementsWebhook(client);
bulkDelete(client);
nasa(client);
restart(client);

channelCreate(client);
channelDelete(client);
channelUpdate(client);
guildBanAdd(client);
guildBanRemove(client);
guildMemberUpdate(client);
message(client);
messageDelete(client);
messageUpdate(client);
roleCreate(client);
roleDelete(client);
roleUpdate(client);
guildMemberAdd(client);
guildBanRemove(client);

client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

client.config = nsfwConfig;
client.on("message", function (message) {
    if (message.author.bot) return;
    if (message.content.indexOf(nsfwConfig.nsfwPrefix) !== 0) return;
    const args = message.content
        .slice(nsfwConfig.nsfwPrefix.length)
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

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));

client.login(TOKEN);

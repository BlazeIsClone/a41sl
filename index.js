const Discord = require("discord.js");
const client = new Discord.Client();
const { Collection } = require("discord.js");
const events = (require("events").EventEmitter.defaultMaxListeners = 20);
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
const Canvas = require("canvas");

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
const statusPresence = require("./src/listeners/statusPresence");
const memberCount = require("./src/listeners/member-count");
const reactionRoles = require("./src/commands/admin/reactionRoles");

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
//welcome(client);
goodbye(client);
streamCommands(client);
statusPresence(client);
memberCount(client);
reactionRoles(client);

client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "welcome"
    );

    if (!channel) return;
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./src/assets/img/wallpaper.png");
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
    var greetings = [
        "Hey Welcome to **All For One SL**!",
        "Welcome to **All For One SL** enjoy your stay!",
        "Hello there welcome to **All For One SL**!",
        "Welcome to **All For One SL** make yourself at home!",
        "Greetings to *All For One SL** make yourself comfy!",
    ];
    var greet = () => greetings[Math.floor(Math.random() * greetings.length)];
    channel.send(`${greet()}, ${member}`, attachment);
});

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

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.login(TOKEN);

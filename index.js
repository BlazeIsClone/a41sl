const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.DISCORD_TOKEN;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./commands/rules.js");
const client = new Discord.Client();
var events = (require("events").EventEmitter.defaultMaxListeners = 15);
const memberCount = require("./commands/member-count");
const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX, STREAM } = require("./config.json");
const moment = require("moment");
var global = require("./global");

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log("Ready!");
    memberCount(client);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "The World 🌎 /help",
            type: "STREAMING",
            details: "Watching Snowv",
            url: "https://www.twitch.tv/snowv_streams"
        }
    });
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

//Ping Command
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/ping") {
        const msg = await message.channel.send("Ping?");
        msg.edit(
            `Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.`
        );
    }
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

const radioChannels = {
    kissRadio: "http://198.178.123.8:8404/;",
    tnlrocksRadio: "http://live.tnlrn.com:8010/live.mp3",
    goldRadio: "http://209.133.216.3:7048/;",
    sunRadio: "http://209.133.216.3:7058/;stream.mp3",
    yesRadio: "http://live.trusl.com:1150/;"
};

//Radio Commands
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} sunfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(radioChannels.sunRadio);
            let embed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Sun Fm**")
                .setImage(
                    "https://lh3.googleusercontent.com/qxVfvXii_pVa5QepZyozdijGPxuSQ957nISY9t9M8DSddQ0JZha2PoopVeiKw5sU0Q4"
                )
                .setFooter("SunFm - Live");
            message.channel.send(embed);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} kissfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(radioChannels.kissRadio);
            let embed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Kiss Fm**")
                .setImage(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/KissFMSriLankaLogo2012.png/220px-KissFMSriLankaLogo2012.png"
                )
                .setFooter("KissFm - Live");
            message.channel.send(embed);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} goldfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(radioChannels.goldRadio);
            let embed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Gold Fm**")
                .setImage(
                    "https://mytuner.global.ssl.fastly.net/media/tvos_radios/XAryWL2prn.jpeg"
                )
                .setFooter("GoldFm - Live");
            message.channel.send(embed);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} tnlfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(radioChannels.tnlrocksRadio);
            let embed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming TNL Fm**")
                .setImage(
                    "https://cdn-profiles.tunein.com/s14406/images/logog.png"
                )
                .setFooter("TnlFm - Live");
            message.channel.send(embed);
        }
    }
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === `${STREAM} yesfm`) {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            dispatcher = connection.play(radioChannels.yesRadio);
            let embed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("**Live Streaming Yes Fm**")
                .setImage(
                    "https://cdn-profiles.tunein.com/s14405/images/logog.png"
                )
                .setFooter("YesFm - Live");
            message.channel.send(embed);
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

client.login(token);

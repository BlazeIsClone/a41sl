const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageEmbed, MessageAttachment, Collection } = require("discord.js");
const Canvas = require("canvas");
const token = process.env.DISCORD_TOKEN;
const ytdl = require("ytdl-core");
const rulesEmbed = require("./commands/rules.js");
const helpEmbed = require("./commands/help.js");
var events = (require("events").EventEmitter.defaultMaxListeners = 15);
const memberCount = require("./commands/member-count");
const { readdirSync } = require("fs");
const { join } = require("path");
const { PREFIX, STREAM } = require("./config.json");
const moment = require("moment");
var global = require("./global");
const { pool, Client } = require("pg");
const Profile = require("./util/profile");
const ImageEditor = require("./util/imageEditor");
const Champion = require("./util/championData");
const Spotlight = require("./util/spotlight");
const Points = require("./util/pointsChanges");
const Admin = require("./util/admin");
const imageEditor = new ImageEditor();
const profile = new Profile();
const champion = new Champion();
const admin = new Admin();
const spotlight = new Spotlight();
const cooldown = new Set();
var regexp = require('regexp')
require("dotenv").config();

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

// Help Command
const helpAttachment = new MessageAttachment("https://i.imgur.com/790FtQS.png");

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/help") {
        message.author.send(helpEmbed).catch(console.error);
        message.author.send(helpAttachment).catch(console.error);
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
    message.author.send("hello");
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

const commands = {
    profile: { regex: new regexp("profile", "gis"), execute: profile.getdata },
    setsummoner: {
        regex: new regexp("setuser", "gis"),
        execute: profile.setUser
    },
    points: { regex: new RegExp("points", "gis") },
    champion: {
        regex: new RegExp("champion", "gis"),
        execute: champion.getData
    },
    aUpdatePoints: {
        regex: new RegExp("updategp", "gis"),
        execute: admin.updatePoints
    },
    borders: {
        regex: new RegExp("borders", "gis")
    },
    updateSummoner: {
        regex: new RegExp("updateUser", "gis"),
        execute: profile.updateUser
    },
    imageEditor: {
        regex: new RegExp("editMe", "gis"),
        execute: imageEditor.uploadImage
    },
    help: {
        regex: new RegExp("help", "gis")
    },
    spotlight: {
        regex: new RegExp("spotlight", "gis"),
        execute: spotlight.getChampionData
    }
};
const messages = [
    "a lot of problems has been fixed",
    "?help",
    "league of legends",
    "world war III",
    "start earning gp",
    "gp = gremilin points",
    "new borders are available",
    "?points",
    "?borders"
];

client.on("message", async message => {
    if (message.author.bot) {
        const embed = message.embeds.find(m => m.title.includes("spotlight"));
        if (embed) {
            message
                .react("1⃣")
                .then(() => message.react("2⃣"))
                .then(() => message.react("3⃣"))
                .then(() => message.react("4⃣"))
                .then(() => message.react("5⃣"));
        }
    }
    if (
        message.author.bot &&
        message.embeds.find(m => m.title.includes("spotlight"))
    ) {
        message
            .awaitReactions((reaction, user) => reaction.count > 1, {
                max: 1,
                time: 60000
            })
            .then(async col => {
                const emoji = col.first().emoji.name;
                const embd = message.embeds.find(m =>
                    m.title.includes("spotlight")
                );
                const [championName] = embd.title.split(" ");
                const {
                    championData,
                    patch,
                    champion
                } = await spotlight.getChampionData(championName);
                if (emoji === "1⃣") {
                    const storyEmbed = new Discord.RichEmbed()
                        .setTitle(`${champion} Story`)
                        .addField(
                            `Story of ${championData.data[champion].name} ${championData.data[champion].title}`,
                            championData.data[champion].lore
                        )
                        .setThumbnail(
                            `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championData.data[champion].image.full}`
                        );
                    message.channel.send(storyEmbed);
                }
                if (emoji === "2⃣") {
                    const storyEmbed = new Discord.RichEmbed()
                        .setTitle(`${champion} Abilities`)
                        .setDescription(
                            `Abilities of ${championData.data[champion].name} ${championData.data[champion].title}`
                        )
                        .setThumbnail(
                            `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championData.data[champion].image.full}`
                        );
                    championData.data[champion].spells.forEach(
                        (spell, index) => {
                            storyEmbed.addField(
                                `${spell.name} [${
                                    index == 0
                                        ? "Q"
                                        : index == 1
                                        ? "W"
                                        : index == 2
                                        ? "E"
                                        : index == 3
                                        ? "R"
                                        : ""
                                }]`,
                                spell.description.replace(
                                    /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|font|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
                                    ""
                                )
                            );
                        }
                    );
                    storyEmbed.addField(
                        `${championData.data[champion].passive.name} [Passive]`,
                        championData.data[champion].passive.description.replace(
                            /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|font|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
                            ""
                        )
                    );
                    message.channel.send(storyEmbed);
                } else if (emoji === "3⃣") {
                    championData.data[champion].skins.forEach(skin => {
                        message.channel.send(skin.name, {
                            files: [
                                `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_${skin.num}.jpg`
                            ]
                        });
                    });
                } else if (emoji === "4⃣") {
                    const tipsEmbed = new Discord.RichEmbed()
                        .setTitle(`${champion} Tips`)
                        .addField(
                            `Tips for ${championData.data[champion].name} ${championData.data[champion].title}`,
                            `${championData.data[champion].allytips
                                .map(tip => `${tip}\n\n`)
                                .join("")}`
                        )
                        .setThumbnail(
                            `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championData.data[champion].image.full}`
                        );
                    message.channel.send(tipsEmbed);
                } else if (emoji === "5⃣") {
                    const tipsEmbed = new Discord.RichEmbed()
                        .setTitle(`How to counter ${champion}`)
                        .addField(
                            `Countering tips for ${championData.data[champion].name} ${championData.data[champion].title}`,
                            `${championData.data[champion].enemytips
                                .map(tip => `${tip}\n\n`)
                                .join("")}`
                        )
                        .setThumbnail(
                            `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championData.data[champion].image.full}`
                        );
                    message.channel.send(tipsEmbed);
                }
            });
        message.delete(50000);
    }

    const content_msg = message.content;
    if (content_msg.startsWith("?")) {
        if (content_msg.match(commands.profile.regex)) {
            commands.profile.execute(message, client);
        } else if (content_msg.match(commands.setSummoner.regex)) {
            commands.setSummoner.execute(message);
        } else if (content_msg.match(commands.updateSummoner.regex)) {
            commands.updateSummoner.execute(message);
        } else if (content_msg.match(commands.imageEditor.regex)) {
            commands.imageEditor.execute(message);
        } else if (content_msg.match(commands.champion.regex)) {
            commands.champion.execute(message);
        } else if (content_msg.match(commands.borders.regex)) {
            const messageStyles1 = new Discord.RichEmbed()
                .setTitle("Gremilin Borders")
                .addField(
                    "Border number 1",
                    "You can start using this border once you hit 50gp"
                )
                .setImage(
                    "https://media.discordapp.net/attachments/657198405852069893/670017837300973568/761.png?width=289&height=430"
                );
            const messageStyles2 = new Discord.RichEmbed()
                .setTitle("Gremilin Borders")
                .addField(
                    "Border number 2",
                    "You can start using this border once you hit 200gp"
                )
                .setImage(
                    "https://media.discordapp.net/attachments/668898486523133975/670018086363201556/527.png?width=289&height=430"
                );
            message.channel.send(messageStyles1);
            message.channel.send(messageStyles2);
            message.channel.send("``?points to see how much points you have``");
        } else if (content_msg.match(commands.points.regex)) {
            const points = new Points(message.author.id);
            const pts = await points.getPoints;
            if (pts !== false) {
                message.reply(`You have ${pts}gp`);
            } else {
                message.channel.send(
                    "Something went wrong, Please set the user first , Use ``?setUser [summoner name] [summoner region]`` to set the user."
                );
            }
        } else if (content_msg.match(commands.help.regex)) {
            const messageStyles = new Discord.RichEmbed()
                .setTitle("Gremilin Commands")
                .setDescription("Gp = Gremilin Points")
                .addField(
                    "**Important**",
                    'If your username on league of legends contains more than one word then wrap the name with the double quotation marks \n ``example: ?updateUser "FNC MagiFelix" euw``'
                )
                .addBlankField()
                .addField(
                    "`` ?setUser [username] [region] ``",
                    "This command will add your league of legends account to Grimilin mind, next time he will remember you :)",
                    true
                )
                .addField(
                    "`` ?updateUser [username] [region]``",
                    "This command will update your league of legends account if already registered.",
                    true
                )
                .addField(
                    "`` ?profile ``",
                    "This command will give you some informations about your account like last match etc...",
                    true
                )
                .addField(
                    "`` ?champion [champion name] ``",
                    "This command will give you all that you need to know about a specific chmapion.",
                    true
                )
                .addField(
                    "`` ?editMe [border number]``",
                    "This command will edit your discord profile picture.",
                    true
                )
                .addField(
                    "``?points``",
                    "This command will show you how much gp you have.",
                    true
                )
                .addField(
                    "``?borders``",
                    "This command will show you all the available borders.",
                    true
                )
                .addField(
                    "``?spotlight [champion name]``",
                    "This command will give you all that you need to know about a champion.",
                    true
                )

                .addField(
                    "``How can i earn gp?``",
                    "You can start earning gp by using the bot, on each command you use, you earn certain amount of points",
                    true
                )
                .setFooter(
                    `Developed with love by Everkers#6416`,
                    "https://i.pinimg.com/236x/f0/10/b2/f010b2798bfaa02c4afd72cb2aef6bfc.jpg"
                );
            message.channel.send(messageStyles);
        } else if (content_msg.match(commands.aUpdatePoints.regex)) {
            const isadmin = admin.isAdmin(message.author.id);
            const [command, amount] = content_msg.split(" ");
            if (isadmin && amount != undefined) {
                admin.updatePoints(message, amount);
            } else {
                message.reply(
                    "Permission denied you are not an admin of gremilin!"
                );
            }
        } else if (content_msg.match(commands.spotlight.regex)) {
            try {
                const messageContent = message.content;
                const [championName] = messageContent
                    .substr(messageContent.indexOf(" ") + 1)
                    .split(" ");
                if (championName != "?spotlight") {
                    const isChampionExist = await spotlight.isChampionExist(
                        championName
                    );
                    if (isChampionExist) {
                        const msgEmbed = new Discord.RichEmbed()
                            .setTitle(`${championName} spotlight`)
                            .setDescription(
                                ` 1⃣ - Story \n
                    2⃣ - Abilities \n
					  3⃣ - Skins \n
					  4⃣ - Tips \n
					  5⃣ - How to counter
				`
                            );

                        message.channel.send(msgEmbed);
                    }
                } else {
                    message.reply("please add a champion name");
                }
            } catch (err) {
                message.channel.send(err.message);
            }
        }
    }
});

client.login(token);

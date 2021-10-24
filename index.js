require("dotenv").config();
const Discord = require("discord.js");
const client = new Client({
    disableMentions: "everyone",
    restTimeOffset: 0,
    intents: [
        Intents.FLAGS.GUILDS,
    ]
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* ---------- DEBUGING ---------- */
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN);

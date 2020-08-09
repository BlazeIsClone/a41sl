const discord = require("discord.js");

const client = new discord.Client();

const token = process.env.token;

client.login(token);

client.on("ready", () => {
    console.log("Blaze Bot Is Online");
});
client.on("message", msg => {
    if (msg.content == "hi") {
        msg.reply("bb i luv u");
    }
});
client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/waren") {
        if (message.member.voice.channel) {
            var connection = await message.member.voice.channel.join();
            const dispatcher = connection.play("http://198.178.123.8:8404/;", {
                volume: 0.5
            });
        }
    } else {
        console.log("else is triggerd");
    }
});



// Create an event listener for new guild members
client.on("guildMemberAdd", member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(
        ch => ch.name === "welcome"
    );
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}. Have Fun and say hi to Pro Pathooke for me XD`);
});

client.on("message", async message => {
    if (!message.guild) return;
    if (message.content === "/palayan") {
        if (message.member.voice.channel) {
            var connection = await message.member.voice.channel.leave();
        }
    }
});
client.on("message", async message => {
    if(!message.guild) return;
    if(message.content === "/hi wifu") {
        message.reply("hello how are you doing", {tts: true});
    }
})

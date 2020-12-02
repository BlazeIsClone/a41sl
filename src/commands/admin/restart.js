const Discord = require("discord.js");
const { PREFIX } = require("../../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
        client.on("message", async (message) => {
                const resMsg = new MessageEmbed()
                        .setColor(0x7289da)
                        .setDescription("🔁 Bot Restarting...");
                if (!message.content.startsWith(PREFIX) || message.author.bot)
                        return;
                let args = message.content
                        .slice(PREFIX.length)
                        .trim()
                        .split(/ +/);
                let command = args.shift().toLowerCase();
                if (command === "restart") {
                        if (!message.member.hasPermission("ADMINISTRATOR"))
                                return message.reply(
                                        "You do not have the permissions to do that"
                                );

                        (async () => {
                                await message.reply(resMsg);
                                try {
                                        process.exit();
                                } catch (err) {
                                        console.log(err);
                                }
                        })();
                }
        });
};

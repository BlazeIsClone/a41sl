const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const os = require("os");

module.exports = (client) => {
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.content === "/server info") {
            let seconds = Math.floor(message.client.uptime / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);

            seconds %= 60;
            minutes %= 60;
            hours %= 24;

            const statsEmbed = new Discord.MessageEmbed()
                .setColor("#00FF00")
                .addField(`:desktop: System Os`, `${os.platform()}`, true)
                .addField(`:gear: Architecture`, `${os.arch()}`, true)
                .addField(
                    `:rocket:  Processor`,
                    `${os.cpus().map((i) => `${i.model}`)[0]}`,
                    true
                )
                .addField(
                    `:pager: RAM`,
                    `${Math.trunc(
                        process.memoryUsage().heapUsed / 1024 / 1000
                    )} MB / ${Math.trunc(
                        os.totalmem() / 1024 / 1000
                    )} MB (${Math.round(
                        (Math.round(
                            process.memoryUsage().heapUsed / 1024 / 1024
                        ) /
                            Math.round(os.totalmem() / 1024 / 1024)) *
                            100
                    )}%)`,
                    true
                )
                .addField(
                    `⏱ Server up Time`,
                    "" +
                        `${days} days, ${hours} hours,\n ${minutes} minutes, ${seconds} seconds` +
                        "",
                    true
                )

                .addField(
                    `:dividers: Library`,
                    `Discord.js ${Discord.version}`,
                    true
                );

            message.reply(statsEmbed).catch(console.error);
        }
    });
};

const DadJokes = require("dadjokes-wrapper");
const { PREFIX } = require("../../../config.json");

module.exports = async (client) => {
        client.on("message", async (message) => {
                if (!message.guild) return;
                if (!message.content.startsWith(PREFIX) || message.author.bot)
                        return;

                let args = message.content
                        .slice(PREFIX.length)
                        .trim()
                        .split(/ +/);

                let command = args.shift().toLowerCase();
                if (!message.member.hasPermission("SEND_MESSAGES"))
                        return message.reply(
                                "You do not have the permissions to send messages in this channel"
                        );

                if (command === "joke") {
                        const joke = new DadJokes();
                        const dadjoke = await joke.randomJoke();
                        message.reply(dadjoke);
                }
        });
};

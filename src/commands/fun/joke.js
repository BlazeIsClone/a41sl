const DadJokes = require("dadjokes-wrapper");
module.exports = {
        name: "joke",
        aliases: [],
        description: "Random jokes",
        async execute(client, message, args) {
                if (!message.member.hasPermission("SEND_MESSAGES"))
                        return message.reply(
                                "You do not have the permissions to send messages in this channel"
                        );

                const joke = new DadJokes();
                const dadjoke = await joke.randomJoke();
                message.reply(dadjoke).catch(console.error);
        },
};

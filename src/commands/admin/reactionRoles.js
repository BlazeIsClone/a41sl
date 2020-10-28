const Discord = require("discord.js");
module.exports = (client) => {
    //const addRolesAttachment = new MessageAttachment("https://i.imgur.com/790FtQS.png");
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.content === "/sudo rolesEmbed") {
            const addRolesEmbed = new Discord.MessageEmbed()

                .setColor("#0099ff")
                .setTitle(
                    "React to this message with the following emotes to receive alearts!"
                )
                .addFields(
                    {
                        name: "​",
                        value: "​",
                    },
                    {
                        name: "🔔 • Live Streams Aleart!",
                        value: "​",
                    },
                    {
                        name: " 🏷 • Game Giveaways!",
                        value: "​",
                    },
                    {
                        name: "📈 • league of Legends Updates",
                        value: "​",
                    },
                    {
                        name: "📦 • Minecraft Updates",
                        value: "​",
                    },
                    {
                        name: "📰 • Wired Magazine Subscription",
                        value: "​",
                    }
                );

            message.channel.send(addRolesEmbed).catch(console.error);
            //message.author.send(addRolesAttachment).catch(console.error);
        }
    });
};

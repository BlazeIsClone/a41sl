const Discord = require("discord.js");
module.exports = (client) => {
    const addRolesAttachment = new MessageAttachment(
        "https://i.imgur.com/XzvxWtQ.png"
    );
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.content === "//rolesEmbed") {
            const addRolesEmbed = new Discord.MessageEmbed()

                .setColor("#0099ff")
                .setDescription(
                    "**To join or leave a role, react to this message with one of the following emotes.**"
                )
                .addFields(
                    {
                        name: "​",
                        value: "​",
                    },
                    {
                        name: ":lol: League of Legends",
                        value: "​",
                    },
                    {
                        name: ":csgo~1: CSGO",
                        value: "​",
                    },
                    {
                        name: ":r6: Rainbow Six Siege",
                        value: "​",
                    },
                    {
                        name: ":amongus: Among Us",
                        value: "​",
                    },
                    {
                        name: ":gta5: GTA Online",
                        value: "​",
                    },
                    {
                        name: ":wow: World of Warcraft",
                        value: "​",
                    },
                    {
                        name: ":fortnite: Fortnite",
                        value: "​",
                    },
                    {
                        name: ":brawlhalla: Brawlhalla",
                        value: "​",
                    }
                );

            (async () => {
                await message.author
                    .send(addRolesAttachment)
                    .catch(console.error);
                try {
                    message.channel.send(addRolesEmbed).catch(console.error);
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    });
};

const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
module.exports = (client) => {
    const addRolesAttachment = new MessageEmbed()
        .setImage("https://i.imgur.com/XzvxWtQ.png")
        .setColor("#00FF00");
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.content === "//rolesEmbed") {
            const addRolesEmbed = new Discord.MessageEmbed()

                .setColor("#00FF00")
                .setTitle(
                    "**To join or leave a role, react to this message with one of the following emotes.**"
                )
                .setDescription(
                    "\n<:lol:788452092935012362> • League of Legends\n\n<:csgo:788451154576408577> • CSGO\n\n<:r6:788451153523769355> • rainbow Six Siege\n\n<:amongus:788451152768663642> • Among Us\n\n<:gta5:788451153394270208> • GTA Online\n\n<:wow:788451154362368020> • World of Warcraft\n\n<:fortnite:788451152752672778> • Fortnite\n\n<:brawlhalla:788451163300167770> • Brawlhalla"
                );

            (async () => {
                await message.channel
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

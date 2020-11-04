const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        const rulesEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(
                "Here you can meet new people and game with everyone and anyone you know. Use the server responsibly and have fun!"
            )
            .setDescription(
                "No blank nicknames. \n No inappropriate nicknames.\n No sexually explicit nicknames.\n No offensive nicknames.\n  No inappropriate profile pictures.\n  No sexually explicit profile pictures.\n  No offensive profile pictures.\n  Moderators reserve the right to change nicknames.\n  Moderators reserve the right to use their own discretion regardless of any rule.\n  No exploiting loopholes in the rules (please report them).\n  No inviting unofficial bots.\n  No bugs, exploits, glitches, hacks, bugs, etc.\n  No questioning the mods.\n  No @mentioning the mods.\n  No asking to be granted roles/moderator roles.\n  Contact the moderators under #request-support for support.\n  No @everyone/@here mentioning without permission.\n  No @mentioning spam.\n  No illegal content.\n No hacking.\n  No publishing of personal information (including real names, addresses, emails, passwords, bank account and credit card information, etc.).\n  No personal attacks.\n  No witch hunting.\n  No harassment.\n  No sexism.\n No racism.\n No hate speech.\n  No religious discussions.\n  No political discussions.\n  No spamming.\n No overusing emojis.\n  No overusing reactions.\n Moderators reserve the right to delete any post.\n  No advertisement without permission.\n  No linking to other servers.\n  Use the right text channel for the topic you wish to discuss.\n No annoying, loud or high pitch noises.\n Reduce the amount of background noise, if possible.\n  Moderators reserve the right to disconnect, mute, deafen, or move members to and from voice channels."
            )
            .setTimestamp()
        const rulesAttachment = new MessageAttachment(
            "https://i.imgur.com/790FtQS.png"
        );
        if (message.content === "/rules") {
            if (message.author.bot) return;
            (async () => {
                await message.author.send(rulesAttachment);
                try {
                    message.author.send(rulesEmbed);
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    });
};

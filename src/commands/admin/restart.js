const Discord = require("discord.js");

module.exports = {
        name: "restart",
        aliases: [],
        description: "Restarts the bot",
        async execute(client, message, args) {
                const resMsg = ` \`\`\`md\n#Restarting Bot...\nThis may take upto a minute\`\`\``;
                if (!message.member.hasPermission("ADMINISTRATOR"))
                        return message.reply(
                                "You do not have the permissions to do that"
                        );

                (async () => {
                        await message.channel.send(resMsg);
                        try {
                                process.exit();
                        } catch (err) {
                                console.log(err);
                        }
                })();
        },
};

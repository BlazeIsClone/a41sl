const Discord = require("discord.js");
const { goodbyeChannelId, guildId } = require("../../config.json");
module.exports = (client) => {
    client.on("ready", async () => {
        const channelId = goodbyeChannelId;

        const updateMembers = (guild) => {
            const channel = guild.channels.cache.get(channelId);
            channel.setName(
                `💂 Members: ${guild.memberCount.toLocaleString()}`
            );

            client.on("guildMemberAdd", (member) =>
                updateMembers(member.guild)
            );
            client.on("guildMemberRemove", (member) =>
                updateMembers(member.guild)
            );
        };
        const guild = client.guilds.cache.get(guildId);
        updateMembers(guild);
    });
};

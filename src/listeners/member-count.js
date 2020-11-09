const Discord = require("discord.js");
module.exports = (client) => {
    client.on("ready", async () => {
        const channelId = "696751851064000554";

        const updateMembers = (guild) => {
            const channel = guild.channels.cache.get(channelId);
            channel.setName(
                `💂 Members: ${guild.memberCount.toLocaleString()}`
            );
        };

        client.on("guildMemberAdd", (member) => updateMembers(member.guild));
        client.on("guildMemberRemove", (member) => updateMembers(member.guild));

        const guild = client.guilds.cache.get(channel.guild.id);
        updateMembers(guild);
    });
};

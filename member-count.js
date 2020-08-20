module.exports = client => {
    const channelId = "745643386588889178";

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(channelId);
        channel.setName(`💂 Members: ${guild.memberCount.toLocaleString()}`);
    };

    client.on("guildMemberAdd", member => updateMembers(member.guild));
    client.on("guildMemberRemove", member => updateMembers(member.guild));

    const guild = client.guilds.cache.get("463027132243771403");
    updateMembers(guild);
};

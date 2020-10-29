const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
    client.on("guildMemberRemove", (member) => {
        const channelGoodBye = member.guild.channels.cache.find(
            (ch) => ch.name === "goodbye"
        );
        if (!channelGoodBye) return;
        const goodbyes = [
            "The magic thing about home is that it feels good to leave, and it feels even better to come back.",
            "Goodbyes are not forever, it simply means we'll miss you until we meet again",
            "It’s time to say goodbye, but I think goodbyes are sad and I’d much rather say hello. Hello to a new adventure.",
            "I can’t remember all the times I told myself to hold on to these moments as they pass",
            "Our memories of yesterday will last a lifetime. We’ll take the best, forget the rest, and someday will find that these are the best of times.",
            "Saying goodbye is the hardest solution of any problem. But sometimes it’s the only choice we have…",
            "It’s not the days in life we remember, rather the moments.",
        ];

        const goodbye = () =>
            goodbyes[Math.floor(Math.random() * goodbyes.length)];
        const goodbyeEmbed = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .setThumbnail(member.user.displayAvatarURL({ format: "jpg" }))
            .setTitle(`** ${member.displayName} it's time to say goodbye**`)
            .setDescription(`${goodbye()}`)
            .setTimestamp();

        channelGoodBye.send(goodbyeEmbed);
    });
};

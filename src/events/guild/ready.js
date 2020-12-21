const Discord = require("discord.js");
const request = require("request");
const { MessageEmbed } = require("discord.js");
const {
    memesChannel,
    memberCountChannelId,
    guildId,
} = require("../../../config.json");

module.exports = async (client) => {
    console.log("MemesAPI ready");
    var interval = setInterval(function () {
        let urls = [
            "https://meme-api.herokuapp.com/gimme/dankmemes",
            "https://meme-api.herokuapp.com/gimme/wholesomememes",
            "https://meme-api.herokuapp.com/gimme/memes",
        ];

        let subreddit = urls[Math.floor(Math.random() * urls.length)];
        return request(subreddit, (err, response, body) => {
            if (err) throw err;
            var data = JSON.parse(body);

            let meme = new Discord.MessageEmbed()
                .setDescription(`**[${data.title}](${data.postLink})**`)
                .setImage(data.url)
                .setFooter(`👍 ${data.ups}`)
                .setColor("#32CD32");

            const memeSendChannel = client.channels.cache.get(memesChannel);
            memeSendChannel.send(meme).catch(console.error);
        });
    }, 1 * 3600000);

    const channelId = memberCountChannelId;

    const updateMembers = (guild) => {
        const channel = guild.channels.cache.get(channelId);
        channel.setName(`💂 Members: ${guild.memberCount.toLocaleString()}`);

        client.on("guildMemberAdd", (member) => updateMembers(member.guild));
        client.on("guildMemberRemove", (member) => updateMembers(member.guild));
    };
    const guild = client.guilds.cache.get(guildId);
    updateMembers(guild);
};

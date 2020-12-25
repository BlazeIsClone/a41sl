const Discord = require("discord.js");

module.exports = {
    name: "neko ",
    aliases: [],
    description: "Nsfw neko",
    async execute(client, message, args) {
        var superagent = require("superagent");

        if (!message.channel.nsfw)
            return message.channel.send(
                ":underage:  This Command Is Only Allowed In NSFW Channels Only!"
            );

        var lo = new Discord.MessageEmbed()
            .setDescription(`🔃 Loading...`)
            .setTimestamp();

        message.channel.send(lo).then((m) => {
            superagent
                .get("https://nekobot.xyz/api/image")
                .query({ type: "neko" })
                .end((err, response) => {
                    var embed_nsfw = new Discord.MessageEmbed().setImage(
                        response.body.message
                    );

                    m.edit(embed_nsfw);
                });
        });
    },
};

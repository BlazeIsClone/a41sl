const Discord = require("discord.js");
var superagent = require("superagent");

module.exports = {
    name: "4k",
    aliases: [],
    description: "Nsfw 4k babes",
    async execute(client, message, args) {
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
                .query({ type: "4k" })
                .end((err, response) => {
                    var embed_nsfw = new Discord.MessageEmbed()
                        //.setDescription(`${response.body.message}`)
                        .setImage(response.body.message);

                    m.edit(embed_nsfw);
                });
        });
    },
};

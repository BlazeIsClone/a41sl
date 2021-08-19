const Discord = require("discord.js");
var superagent = require("superagent");

module.exports = {
    name: "nsfw-ass",
    description: "nsfw ass",
    async execute(message, args) {
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
                .query({ type: "ass" })
                .end((err, response) => {
                    var embed_nsfw = new Discord.MessageEmbed()
                        //.setDescription(`${response.body.message})`)
                        .setImage(response.body.message);

                    m.edit(embed_nsfw);
                });
        });
    },
};

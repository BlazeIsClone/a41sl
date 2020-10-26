const Discord = require("discord.js");
module.exports.run = (client, message, args) => {
    var superagent = require("superagent");

    if (!message.channel.nsfw)
        return message.channel.send(
            ":underage:  This Command Is Only Allowed In NSFW Channels Only!"
        );

    var lo = new Discord.MessageEmbed()
        .setDescription(`Loading... <a:Loading:592829210054098944>`)
        .setTimestamp();

    message.channel.send(lo).then(m => {
        superagent
            .get("https://nekobot.xyz/api/image")
            .query({ type: "pgif" })
            .end((err, response) => {
                var embed_nsfw = new Discord.MessageEmbed()
                    //.setDescription(`(${response.body.message})`)
                    .setImage(response.body.message);

                m.edit(embed_nsfw);
            });
    });
};

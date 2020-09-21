const Discord = require("discord.js");
module.exports.run = (client, message, args) => {
    var superagent = require("superagent");

    if (!message.channel.nsfw)
        return message.channel.send(
            ":underage:  This Command Is Only Allowed In NSFW Channels Only!"
        );

    var lo = new Discord.MessageEmbed()
        .setDescription(`Veuillez patienter... <a:Loading:592829210054098944>`)
        .setTimestamp();

    message.channel.send(lo).then(m => {
        superagent
            .get("https://nekobot.xyz/api/image")
            .query({ type: "anal" })
            .end((err, response) => {
                var embed_nsfw = new Discord.MessageEmbed()
                    .setDescription(
                        `:underage:\n**[L'image ne se charge pas ? cliquez ici](${response.body.message})**`
                    )
                    .setTimestamp()
                    .setImage(response.body.message);

                m.edit(embed_nsfw);
            });
    });
};

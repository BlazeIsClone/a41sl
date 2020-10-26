const Discord = require("discord.js");
module.exports.run = (client, message, args) => {
    if (!message.channel.nsfw)
        return message.channel.send(
            ":underage:  The Help Command For NSFW Content Is Only Allowed In NSFW Channels!"
        );

    var help = new Discord.MessageEmbed()
        .setAuthor("NSFW Help :")
        .setDescription("**Prefix : /nsfw **\n List of Commands!")
        .addField(
            ":underage:  NSFW :",
            "`4k`, `anal`, `ass`, `hentai`, `hkitsune`, `hneko`, `holo`, `kemonomimi`, `neko`, `pussy`"
        );
    message.channel.send(help);
};

const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Display all commands and descriptions",
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle("All For One Bot Help")
            .setImage("attachment:./src/.img/SERVER_ICON.jpg")
            .setDescription("List of all commands")
            .setColor("#F8AA2A")
            .addFields(
                { name: "Stream Live Radio" },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "Yes Fm",
                    value: "/stream yesfm",
                    inline: true
                },
                {
                    name: "Sun Fm",
                    value: "/stream sunfm",
                    inline: true
                },
                {
                    name: "Kiss Fm",
                    value: "/stream kissfm",
                    inline: true
                },
                {
                    name: "Gold Fm",
                    value: "/stream goldfm",
                    inline: true
                },

                {
                    name: "TNL Radio",
                    value: "/stream tnlfm",
                    inline: true
                },
                {
                    name: "Fox Radio",
                    value: "/stream foxfm",
                    inline: true
                }
            )

            .setTimestamp();
        return message.channel.send(helpEmbed).catch(console.error);
    }
};

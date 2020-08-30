const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Display all commands and descriptions",
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle("All For One Bot Help")
            .setDescription("List of all commands")
            .setColor("#F8AA2A")
            .setTimestamp()
            .addFields(
                { name: "Regular field title", value: "Some value here" },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "Inline field title",
                    value: "Some value here",
                    inline: true
                },
                {
                    name: "Inline field title",
                    value: "Some value here",
                    inline: true
                }
            );

        return message.channel.send(helpEmbed).catch(console.error);
    }
};

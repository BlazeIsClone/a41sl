const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skip the currently playing song",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return message
                .reply("There is nothing playing that I could skip for you.")
                .catch(console.error);
        if (!canModifyQueue(message.member)) return;
        const skip = new MessageEmbed()
            .setColor(0x7289da)
            .setTitle("Skipped")
            .setDescription(`${message.author} ⏭ skipped the song`);

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(skip).catch(console.error);
    },
};

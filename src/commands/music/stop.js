const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");
const musicChannel = process.env.MUSIC_CHANNEL;

module.exports = {
    name: "stop",
    description: "Stops the music",
    execute(message) {
        if (message.channel.id != musicChannel) {
            return message.author.send(
                "⛔ Music commands are only available in **add-music** channel"
            );
        }

        const queue = message.client.queue.get(message.guild.id);

        const embedA = new MessageEmbed()
            .setColor(0xda7272)
            .setTitle("Empty Queue")
            .setDescription("There is nothing in the queue");

        if (!queue) return message.reply(embedA).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();

        const embedB = new MessageEmbed()
            .setColor(0x7289da)
            .setTitle("Stopped!")
            .setDescription(`**${message.author}** stoped the music`);

        queue.textChannel.send(embedB).catch(console.error);
    },
};

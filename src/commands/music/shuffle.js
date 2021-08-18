const { canModifyQueue } = require("../../util/Util");
const { MessageEmbed } = require("discord.js");
const {
    musicChannelOne,
    musicChannelTwo,
    musicChannelErrorResponse,
    primaryColor,
    errorColor,
} = require("../../../config.json");

module.exports = {
    name: "shuffle",
    description: "Shuffle queue",
    execute(message) {
        if (
            message.channel.id != musicChannelOne &&
            message.channel.id != musicChannelTwo
        ) {
            return message.author.send(musicChannelErrorResponse);
        }
        const queue = message.client.queue.get(message.guild.id);

        const noQ = new MessageEmbed()
            .setColor(errorColor)
            .setTitle("Empty Queue")
            .setDescription(`There is nothing in the queue`);

        if (!queue) return message.channel.send(noQ).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        const shuffled = new MessageEmbed()
            .setColor(primaryColor)
            .setTitle("Shuffled")
            .setDescription(`${message.author} shuffled the queue`);

        queue.textChannel.send(shuffled).catch(console.error);
    },
};

const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");
const musicChannel = process.env.MUSIC_CHANNEL;

module.exports.run = async (client, message, args) => {
    if (message.channel.id != musicChannel) {
        return message.author.send(
            "⛔ Music commands are only available in **add-music** channel"
        );
    }

    const queue = message.client.queue.get(message.guild.id);

    const noQ = new MessageEmbed()
        .setColor(0xda7272)
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
        .setColor(0x7289da)
        .setTitle("Shuffled")
        .setDescription(`${message.author} shuffled the queue`);

    queue.textChannel.send(shuffled).catch(console.error);
};

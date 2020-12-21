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
    if (!queue)
        return message
            .reply("There is nothing playing that I could skip for you.")
            .catch(console.error);
    if (!canModifyQueue(message.member)) return;
    const skipEmbed = new MessageEmbed()
        .setColor(0x7289da)
        .setTitle("Skipped")
        .setDescription(`${message.author} ⏭ skipped the song`);

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(skipEmbed).catch(console.error);
};

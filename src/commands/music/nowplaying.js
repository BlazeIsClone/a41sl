const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const {
    musicChannelOne,
    musicChannelTwo,
    musicChannelErrorResponse,
} = require("../../../config.json");

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    description: "Show now playing song",
    execute(message) {
        if (
            message.channel.id != musicChannelOne &&
            message.channel.id != musicChannelTwo
        ) {
            return message.author.send(musicChannelErrorResponse);
        }
        const queue = message.client.queue.get(message.guild.id);
        const emptyQueue = new MessageEmbed()
            .setColor(0xda7272)
            .setTitle("Empty Queue")
            .setDescription("There is nothing playing");

        if (!queue) return message.reply(emptyQueue).catch(console.error);
        const song = queue.songs[0];
        const seek =
            (queue.connection.dispatcher.streamTime -
                queue.connection.dispatcher.pausedTime) /
            1000;
        const left = song.duration - seek;

        let nowPlaying = new MessageEmbed()
            .setDescription(`**[${song.title}](${song.url})**`)
            .setColor("#00FF00")
            .setImage(`${song.thumbnail}`)
            .addField(
                "\u200b",
                createBar(
                    song.duration == 0 ? seek : song.duration,
                    seek,
                    20
                )[0] +
                    "\n" +
                    "[" +
                    new Date(seek * 1000).toISOString().substr(11, 8) +
                    "/" +
                    (song.duration == 0
                        ? " ◉ LIVE"
                        : new Date(song.duration * 1000)
                              .toISOString()
                              .substr(11, 8)) +
                    "]",
                false
            );

        if (song.duration > 0)
            nowPlaying.setFooter(
                "Time Remaining: " +
                    new Date(left * 1000).toISOString().substr(11, 8)
            );

        return message.channel.send(nowPlaying);
    },
};

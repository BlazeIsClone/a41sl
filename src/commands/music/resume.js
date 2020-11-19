const { canModifyQueue } = require("../../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "resume",
    aliases: ["r"],
    description: "Resume currently playing music",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        const nothingPlaying = new MessageEmbed()
            .setColor(0xda7272)
            .setTitle("Error!")
            .setDescription(`There is nothing playing`);

        if (!queue) return message.reply(nothingPlaying).catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            const resumed = new MessageEmbed()
                .setColor(0x7289da)
                .setTitle("Resumed")
                .setDescription(`${message.author} ▶ resumed the music`);

            return queue.textChannel.send(resumed).catch(console.error);
        }

        return message.reply("The queue is not paused.").catch(console.error);
        const notPaused = new MessageEmbed()
            .setColor(0xda7272)
            .setTitle("Error!")
            .setDescription(`The song/queue is not paused`);

        return message.reply(notPaused).catch(console.error);
    },
};

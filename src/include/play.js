const Discord = require("discord.js");
const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  async play(song, message) {
    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;
    const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;

    const queue = message.client.queue.get(message.guild.id);
    const muiscQueueEnded = new Discord.MessageEmbed()
      .setDescription("❌ Music queue ended.")
      .setColor("#FF0000");

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send(muiscQueueEnded).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.OPUS,
            SOUNDCLOUD_CLIENT_ID
          );
        } catch (error) {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.MP3,
            SOUNDCLOUD_CLIENT_ID
          );
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(
        `Error: ${error.message ? error.message : error}`
      );
    }

    queue.connection.on("disconnect", () =>
      message.client.queue.delete(message.guild.id)
    );

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    const playingEmbed = new Discord.MessageEmbed()
      .setColor("#0084ff")
      .setTitle("🎵⠀Now Playing")
      .setDescription(`\`${song.title}\``)
      .setThumbnail(
        song.thumbnail ||
          "https://cdn.iconscout.com/icon/free/png-256/youtube-85-226402.png"
      )
      .addField(`Song's url`, `${song.url}`)
      .setFooter(`${message.author.tag}`);
    try {
      var playingMessage = await queue.textChannel.send(playingEmbed);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
      await playingMessage.react("🔀");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000,
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel
            .send(`${user} ⏩ skipped the song`)
            .catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel
              .send(`${user} ⏸ paused the music.`)
              .catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel
              .send(`${user} ▶ resumed the music!`)
              .catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel
            .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
            .catch(console.error);
          break;

        case "🔀":
          reaction.users.remove(user).catch(console.error);
          if (!queue)
            return message.channel
              .send("There is no queue.")
              .catch(console.error);
          if (!canModifyQueue(member)) return;
          let songs = queue.songs;
          queue.songs = songs;
          for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
          }
          message.client.queue.set(message.guild.id, queue);
          queue.textChannel
            .send(`${user} 🔀 shuffled the queue.`)
            .catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel
            .send(`${user} ⏹ stopped the music!`)
            .catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  },
};

const { play } = require("../../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader");
const { MessageEmbed } = require("discord.js");
const musicChannel = process.env.MUSIC_CHANNEL;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);

    const requiredVC = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setAuthor(`${message.author.tag}`)
      .setTitle("Error!")
      .setDescription("Please join a voice channel before run this command");

    if (message.channel.id != musicChannel) {
      return message.author.send(
        "⛔ Music commands are only available in **add-music** channel"
      );
    }

    if (!channel) return message.channel.send(requiredVC).catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel) {
      const sameVC = new MessageEmbed()
        .setColor(0xda7272)
        .setTimestamp()
        .setAuthor(`${message.author.tag}`)
        .setTitle("Error!")
        .setDescription(
          `You must be in the same channel as ${message.client.user}`
        );

      return message.channel.send(sameVC).catch(console.error);
    }
    const argsThrow = new MessageEmbed()
      .setColor(0xda7272)
      .setTitle("Play")
      .setDescription(
        `Usage: ${message.client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`
      );

    if (!args.length) return message.reply(argsThrow).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
      const vcError = new MessageEmbed()
        .setColor(0xda7272)
        .setTimestamp()
        .setTitle("Voice Channel Error!")
        .setDescription(
          "Cannot connect to the voice channel, Missing Permissions"
        );

      return message.reply(vcError);
    }
    if (!permissions.has("SPEAK")) {
      const unableSpeak = new MessageEmbed()
        .setColor(0xda7272)
        .setTimestamp()
        .setAuthor(`${message.author.tag}`)
        .setTitle("Audio Error!")
        .setDescription(
          "I cannot speak in this voice channel, make sure I have the proper permissions"
        );

      return message.channel.send(unableSpeak);
    }
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true,
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[3].url,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000),
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[3].url,
          duration: songInfo.videoDetails.lengthSeconds,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }
    const addedSongToQueue = new MessageEmbed()
      .setThumbnail(
        song.thumbnail ||
          "https://cdn.iconscout.com/icon/free/png-256/youtube-85-226402.png"
      )
      .setTitle("Queued")
      .setDescription(`**[${song.title}](${song.url})**`);

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(addedSongToQueue)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();

      const unableJoin = new MessageEmbed()
        .setColor(0xda7272)
        .setTimestamp()
        .setTitle("Error!")
        .setDescription(`Could not join join the channel: ${error}`);

      return message.channel.send(unableJoin).catch(console.error);
    }
  },
};

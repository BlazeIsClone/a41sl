const Discord = require("discord.js");
const request = require("request");
const { MessageEmbed } = require("discord.js");
const {
  memesChannelId,
  memberCountChannelName,
  primaryColor,
  errorColor,
} = require("../../../config.json");

module.exports = async (client) => {
  console.log("MemesAPI ready");
  var interval = setInterval(function () {
    let urls = [
      "https://meme-api.herokuapp.com/gimme/dankmemes",
      "https://meme-api.herokuapp.com/gimme/wholesomememes",
      "https://meme-api.herokuapp.com/gimme/memes",
    ];

    let subreddit = urls[Math.floor(Math.random() * urls.length)];
    return request(subreddit, (err, response, body) => {
      if (err) throw err;
      var data = JSON.parse(body);

      let meme = new Discord.MessageEmbed()
        .setDescription(`**[${data.title}](${data.postLink})**`)
        .setImage(data.url)
        .setFooter(`👍 ${data.ups}`)
        .setColor(primaryColor);

      const memeSendChannel = client.channels.cache.get(memesChannelId);
      memeSendChannel.send(meme).catch(console.error);
    });
  }, 1 * 3600000);

  const getGuildId = client.guilds.cache.map((guild) => guild.id);
  const getGuildName = client.guilds.cache.map((guild) => guild.name);

  const guild = `${getGuildId}`;
  const guildName = `${getGuildName}`;

  console.log(`Bot Connected to : ${guildName}`);

  function updateMembers(guild) {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === memberCountChannelName
    );

    channel.setName(`💂 Members: ${guild.memberCount.toLocaleString()}`);

    client.on("guildMemberAdd", (member) => updateMembers(member.guild));
    client.on("guildMemberRemove", (member) => updateMembers(member.guild));
  }
};

const Discord = require("discord.js");

module.exports = async (client) => {
  const arrayOfStatus = [
    `${client.guilds.cache.map((guild) => guild.name)}`,
    `${client.guilds.cache.map((guild) => guild.memberCount)} members`,
    `${client.guilds.cache.map((guild)=> guild.premiumSubscriptionCount)} boosts`,
  ];

  console.log(`Logged in as ${client.user.username}!`);
  console.log("Discord.js API Ready! ⚡");
  let index = 0;

  setInterval(() => {
    if (index === arrayOfStatus.length) index = 0;
    const status = arrayOfStatus[index];
    client.user.setPresence({
      status: "online",
      activity: {
        name: `${status}`,
        type: "WATCHING",
        details: null,
        url: null,
      },
    });
    index++;
  }, 10 * 1000);
};

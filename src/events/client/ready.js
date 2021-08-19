const Discord = require("discord.js");

module.exports = async (client) => {

const arrayOfStatus = [`Welcome to ${client.guilds.cache.map((guild) => guild.name)}`, "Have Fun!", "Do Crazy Shit!", "Dont Kill ur self"]

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
        type: "PLAYING",
        details: null,
        url: null,
      },
    });
    index++;
  }, 5000);
};

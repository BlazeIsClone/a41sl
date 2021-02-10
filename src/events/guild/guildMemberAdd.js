const Discord = require("discord.js");
const Canvas = require("canvas");
const { welcomeChannel } = require("../../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === welcomeChannel
  );

  if (!channel) return;
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage("./src/assets/img/wallpaper.png");
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#0800ff";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = "28px Helvetica";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    "Welcome to the server,",
    canvas.width / 2.5,
    canvas.height / 3.5
  );
  const applyText = (canvas, text) => {
    const ctx = canvas.getContext("2d");

    let fontSize = 70;

    do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${(fontSize -= 10)}px Helvetica`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
  };

  ctx.font = applyText(canvas, `${member.displayName}`);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `${member.displayName}`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );

  const guild = client.guilds.cache.get(channel.guild.id);
  var getmemberCount = guild.memberCount;
  ctx.font = "24px Helvetica";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `Member #${getmemberCount}`,
    canvas.width / 2.5,
    canvas.height / 1.45
  );
  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg" })
  );
  ctx.drawImage(avatar, 25, 25, 200, 200);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );
  const greetings = [
    "Hey Welcome to **All For One SL**!",
    "Welcome to **All For One SL** enjoy your stay!",
    "Hello there welcome to **All For One SL**!",
    "Welcome to **All For One SL** make yourself at home!",
    "Greetings to **All For One SL** make yourself comfy!",
  ];
  const greet = () => greetings[Math.floor(Math.random() * greetings.length)];
  channel.send(`${greet()}, ${member}`, attachment);

  const serverName = member.guild.name;
  const welcomeDm =
    `Hello and welcome to **${serverName}**` +
    "\n" +
    "Please take a moment to verify yourself in <#749981223287521381> and feel free to assign yourself some roles from <#751076769486078062>" +
    "\n" +
    "if you have any further questions or feedback, please feel free to DM to <@808921187031580673>." +
    "\n" +
    "👋 Stay **safe** and stay **connected**";

  const sendBanner = new MessageEmbed()
    .setColor("00FF00")
    .setImage("https://i.imgur.com/PLMbw6K.png");

  await member.send(sendBanner);
  member.send(welcomeDm);
};

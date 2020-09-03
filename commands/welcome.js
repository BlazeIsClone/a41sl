const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

const canvas = Canvas.createCanvas(700, 250);

const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
);

exports.attachment = attachment;

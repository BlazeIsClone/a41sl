require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageEmbed, MessageAttachment } = require("discord.js");
const STREAM = process.env.STREAM_PREFIX;
var global = require("./global");
const {
    sunRadio,
    kissRadio,
    tnlrocksRadio,
    goldRadio,
    yesRadio,
} = require("../config.json");

module.exports = {
    async execute(message) {
        if (!message.guild) return;
        if (message.content === `${STREAM} sunfm`) {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(sunRadio);
                let sunEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Sun Fm**")
                    .setThumbnail(
                        "https://lh3.googleusercontent.com/qxVfvXii_pVa5QepZyozdijGPxuSQ957nISY9t9M8DSddQ0JZha2PoopVeiKw5sU0Q4"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7")
                    .setFooter("SunFm - Live");
                message.channel.send(sunEmbed).then((sunEmbed) => {
                    sunEmbed.react("⏹");

                    const filter = (reaction, user) => {
                        return (
                            ["⏹"].includes(reaction.emoji.name) &&
                            user.id === message.author.id
                        );
                    };

                    sunEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                message.reply("⏹ Stoped the stream");
                                dispatcher.end();
                                connection = message.member.voice.channel.leave();
                                sunEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch((collected) => {
                            console.log("error 100");
                        });
                });
            }
        } else if (message.content === `${STREAM} yesfm`) {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(yesRadio);
                let yesEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Yes Fm**")
                    .setThumbnail(
                        "https://cdn-profiles.tunein.com/s14405/images/logog.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7")
                    .setFooter("YesFm - Live");
                message.channel.send(yesEmbed).then((yesEmbed) => {
                    yesEmbed.react("⏹");

                    const filter = (reaction, user) => {
                        return (
                            ["⏹"].includes(reaction.emoji.name) &&
                            user.id === message.author.id
                        );
                    };

                    yesEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                message.reply("⏹ Stoped the stream");
                                dispatcher.end();
                                connection = message.member.voice.channel.leave();
                                yesEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch((collected) => {
                            console.log("error catched");
                        });
                });
            }
        } else if (message.content === `${STREAM} kissfm`) {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(kissRadio);
                let kissEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Kiss Fm**")
                    .setThumbnail(
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/KissFMSriLankaLogo2012.png/220px-KissFMSriLankaLogo2012.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7")
                    .setFooter("KissFm - Live");
                message.channel.send(kissEmbed).then((kissEmbed) => {
                    kissEmbed.react("⏹");

                    const filter = (reaction, user) => {
                        return (
                            ["⏹"].includes(reaction.emoji.name) &&
                            user.id === message.author.id
                        );
                    };

                    kissEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                message.reply("⏹ Stoped the stream");
                                dispatcher.end();
                                connection = message.member.voice.channel.leave();
                                kissEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch((collected) => {
                            console.log("error catched");
                        });
                });
            }
        } else if (message.content === `${STREAM} tnlfm`) {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(tnlrocksRadio);
                let tnlEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming TNL Fm**")
                    .setThumbnail(
                        "https://cdn-profiles.tunein.com/s14406/images/logog.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7")
                    .setFooter("TnlFm - Live");
                message.channel.send(tnlEmbed).then((tnlEmbed) => {
                    tnlEmbed.react("⏹");

                    const filter = (reaction, user) => {
                        return (
                            ["⏹"].includes(reaction.emoji.name) &&
                            user.id === message.author.id
                        );
                    };

                    tnlEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                message.reply("⏹ Stoped the stream");
                                dispatcher.end();
                                connection = message.member.voice.channel.leave();
                                tnlEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch((collected) => {
                            console.log("error catched");
                        });
                });
            }
        } else if (message.content === `${STREAM} goldfm`) {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(goldRadio);
                let goldEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Gold Fm**")
                    .setThumbnail(
                        "https://mytuner.global.ssl.fastly.net/media/tvos_radios/XAryWL2prn.jpeg"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7")
                    .setFooter("GoldFm - Live");
                message.channel.send(goldEmbed).then((goldEmbed) => {
                    goldEmbed.react("⏹");

                    const filter = (reaction, user) => {
                        return (
                            ["⏹"].includes(reaction.emoji.name) &&
                            user.id === message.author.id
                        );
                    };

                    goldEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                message.reply("⏹ Stoped the stream");
                                dispatcher.end();
                                connection = message.member.voice.channel.leave();
                                goldEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch((collected) => {
                            console.log("error catched");
                        });
                });
            }
        }
    },
};

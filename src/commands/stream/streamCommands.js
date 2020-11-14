const Discord = require("discord.js");
const STREAM = process.env.STREAM_PREFIX;
const musicChannel = process.env.MUSIC_CHANNEL;
const {
    sunRadio,
    kissRadio,
    tnlrocksRadio,
    goldRadio,
    yesRadio,
} = require("./streams.json");

//stop command is nested
module.exports = (client) => {
    client.on("message", async (message) => {
        if (!message.guild) return;
        if (message.author.bot) return;

        const streamNotInChannel = () => {
            const { channel } = message.member.voice;
            if (!channel) {
                return message
                    .reply("You need to join a voice channel first!")
                    .catch(console.error);
            }
        };
        const stopStream = () => {
            message.reply("⏹ Stoped the stream");
            connection = message.member.voice.channel.leave();
        };

        const filter = (reaction, user) => {
            return (
                ["⏹"].includes(reaction.emoji.name) &&
                user.id === message.author.id
            );
        };
        if (
            message.content.includes(`${STREAM}`) &&
            message.channel.id != musicChannel
        ) {
            return message.author.send(
                "⛔ Music commands are only available in **add-music channel**"
            );
        }
        if (message.content === `${STREAM} sunfm`) {
            streamNotInChannel();
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(sunRadio);
                let sunEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Sun Fm**")
                    .setThumbnail(
                        "https://lh3.googleusercontent.com/qxVfvXii_pVa5QepZyozdijGPxuSQ957nISY9t9M8DSddQ0JZha2PoopVeiKw5sU0Q4"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7");
                message.channel.send(sunEmbed).then((sunEmbed) => {
                    sunEmbed.react("⏹");
                    sunEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                stopStream();
                                sunEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch(console.error);
                });
            }
        } else if (message.content === `${STREAM} yesfm`) {
            streamNotInChannel();
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(yesRadio);
                let yesEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Yes Fm**")
                    .setThumbnail(
                        "https://cdn-profiles.tunein.com/s14405/images/logog.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7");
                message.channel.send(yesEmbed).then((yesEmbed) => {
                    yesEmbed.react("⏹");
                    yesEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                stopStream();
                                yesEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })

                        .catch(console.error);
                });
            }
        } else if (message.content === `${STREAM} kissfm`) {
            streamNotInChannel();
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(kissRadio);
                let kissEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Kiss Fm**")
                    .setThumbnail(
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/KissFMSriLankaLogo2012.png/220px-KissFMSriLankaLogo2012.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7");
                message.channel.send(kissEmbed).then((kissEmbed) => {
                    kissEmbed.react("⏹");
                    kissEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                stopStream();
                                kissEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch(console.error);
                });
            }
        } else if (message.content === `${STREAM} tnlfm`) {
            streamNotInChannel();
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(tnlrocksRadio);
                let tnlEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming TNL Fm**")
                    .setThumbnail(
                        "https://cdn-profiles.tunein.com/s14406/images/logog.png"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7");
                message.channel.send(tnlEmbed).then((tnlEmbed) => {
                    tnlEmbed.react("⏹");

                    tnlEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                stopStream();
                                tnlEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch(console.error);
                });
            }
        } else if (message.content === `${STREAM} goldfm`) {
            streamNotInChannel();
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                dispatcher = connection.play(goldRadio);
                let goldEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**Live Streaming Gold Fm**")
                    .setThumbnail(
                        "https://mytuner.global.ssl.fastly.net/media/tvos_radios/XAryWL2prn.jpeg"
                    )
                    .setDescription(":red_circle: Streaming Live 24/7");
                message.channel.send(goldEmbed).then((goldEmbed) => {
                    goldEmbed.react("⏹");

                    goldEmbed
                        .awaitReactions(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === "⏹") {
                                stopStream();
                                goldEmbed.reactions
                                    .removeAll()
                                    .catch(console.error);
                            }
                        })
                        .catch(console.error);
                });
            }
        }
        if (message.content === "/stop") {
            connection = message.member.voice.channel.leave();
        }
    });
};

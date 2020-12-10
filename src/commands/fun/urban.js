const Discord = require("discord.js");
const fetch = require("node-fetch");
const request = require("request");
const { memesChannel } = require("../../../config.json");
const { MessageEmbed } = require("discord.js");
const { PREFIX } = require("../../../config.json");
const querystring = require("querystring");

module.exports = async (client) => {
        client.on("message", async (message) => {
                if (message.author.bot) return;
                if (!message.content.startsWith(PREFIX) || message.author.bot)
                        return;

                let args = message.content
                        .slice(PREFIX.length)
                        .trim()
                        .split(/ +/);

                let command = args.shift().toLowerCase();

                if (!message.member.hasPermission("SEND_MESSAGES"))
                        return message.reply(
                                "You do not have the permissions to send messages in this channel"
                        );

                if (command === "urban") {
                        if (!args)
                                return message.reply(
                                        "Please specify your search"
                                );
                        const trim = (str, max) =>
                                str.length > max
                                        ? `${str.slice(0, max - 3)}...`
                                        : str;

                        const query = querystring.stringify({
                                term: args.searchquery,
                        });

                        const { list } = await fetch(
                                `https://api.urbandictionary.com/v0/define?${query}`
                        ).then((response) => response.json());

                        if (!list.length) {
                                return message.channel.send(
                                        `No results found for **${args.searchquery}**.`
                                );
                        }

                        let [answer] = list;

                        const embed = new Discord.MessageEmbed()
                                .setColor("YELLOW")
                                .setTitle(answer.word)
                                .setURL(answer.permalink)
                                .addField(
                                        "Definition",
                                        trim(answer.definition, 1024)
                                )
                                .addField(
                                        "Examples",
                                        trim(answer.example, 1024)
                                )
                                .addField(
                                        "Rating",
                                        `${answer.thumbs_up} 👍 | ${answer.thumbs_down} 👎`
                                );

                        message.channel.send(embed);
                }
        });
};

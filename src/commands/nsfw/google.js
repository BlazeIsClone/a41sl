const google = require('google');
const Discord = require(`discord.js`);
exports.run = (client, message) => {
    let args = message.content.split(/[ ]+/);
    let suffix = args.slice(1).join(' ');
    if (!suffix) {
        message.channel.send({
            embed: {
                color: 0xff2727,
                description: `:warning: **${message.author.username}**, You didn't give me anything to search. {m!google \`input\`}`,
                footer: {
                    text: 'API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms',
                }
            }
        });
    }
    google.resultsPerPage = 25;
    google(suffix, function (err, res) {
        if (err) message.channel.send({
            embed: {
                color: 0xff2727,
                description: `:warning: **${message.author.username}**, ${err}`,
                footer: {
                    text: 'API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms',
                }
            }
        });
        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            if (!link.href) {
                res.next;
            } else {
                let embed = new Discord.RichEmbed()
                    .setColor(`#ffffff`)
                    .setAuthor(`Result for "${suffix}"`, `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png`)
                    .setDescription(`**Link**: [${link.title}](${link.href})\n**Description**:\n${link.description}`)
                    .setTimestamp()
                    .setFooter('API Lantancy is ' + `${Date.now() - message.createdTimestamp}` + ' ms', message.author.displayAvatarURL);
                return message.channel.send({
                    embed: embed
                });
            } return message.react("👌");
        }
    });
};

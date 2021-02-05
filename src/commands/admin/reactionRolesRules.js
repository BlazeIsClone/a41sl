const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "rrr",
    description: "Sends an embed with a rules",
    async execute(message, args) {
        const rulesEmbed = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .setDescription(
                "Here you can meet new people and game with everyone and anyone you know. Use the server responsibly and have fun!" +
                    "\n\n" +
                    "**1. Be kind**" +
                    "\n" +
                    "Treat others with kindness and respect, please don’t be rude to others. We want this server to be a place where you can join and chat with people with similar interests. Nobody comes here to argue with others on purpose." +
                    "\n\n" +
                    "**2. Advertisemen**t" +
                    "\n" +
                    "Only Promote social media content in the advertising category. DM advertising is not allowed according to Discord's Terms of Service." +
                    "\n\n" +
                    "**3. Do not spam**" +
                    "\n\n" +
                    "To keep our server satisfied, we would appreciate it if you do not spam. This includes pinging a member for no reason and posting text walls. We will not hesitate to mute or ban you." +
                    "\n\n" +
                    "**4. Content Posting**" +
                    "\n" +
                    "Keep an eye on the content you post and it must be relevant to the text-channel in which your posting. You may not share content that glorifies or promotes suicide or self-harm." +
                    "\n\n" +
                    "**5. No Inappropriate User Profiles**" +
                    "\n" +
                    "For ease of communication and the comfort of those in chat, the profile picture, custom status, and display name should be in line with the Discord community guidelines. Furthermore, the display name should also be easily readable, mentionable and appropriate." +
                    "\n\n" +
                    "**6. No Scamming**" +
                    "\n" +
                    "Any member caught scamming will be banned. It's the internet; not everyone will be friendly or have good intentions. Please, be cautious and use common sense." +
                    "\n\n" +
                    "**7. Follow the Discord ToS and Community Guidelines**" +
                    "\n" +
                    "It’s stated on their website, follow them. They are made to be followed." +
                    "\n" +
                    "Terms of Service: https://discordapp.com/terms" +
                    "\n" +
                    "Guidelines: https://discordapp.com/guidelines"
            );

        const rulesEmbed2 = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .setDescription(
                "If you agree to all the rules above, click on the ✅ at the end of this post to gain access to the rest of the server. After doing so, you can head to <#751076769486078062> to assign yourself personalized roles!"
            );
        const rulesAttachment = new MessageEmbed()
            .setImage("https://i.imgur.com/TBGYIJ7.png")
            .setColor("#00FF00");
        message.channel.send(rulesAttachment);
        message.channel.send(rulesEmbed);
        message.channel.send(rulesEmbed2);
    },
};

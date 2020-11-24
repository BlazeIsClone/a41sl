module.exports = {
    canModifyQueue(member) {
        const { channel } = member.voice;
        const botChannel = member.guild.me.voice.channel;

        if (channel !== botChannel) {
            member
                .send("You need to join the voice channel first!")
                .catch(console.error);
            return false;
        }

        return true;
    },
};

let config;

try {
    config = require("../../config.json");
} catch (error) {
    config = null;
}
exports.STAY_TIME = config ? config.STAY_TIME : process.env.STAY_TIME;

const Discord = require("discord.js");
const axios = require("axios").default;
const { riotAPIToken } = require("../../../config.json");

module.exports = {
  name: "lolrotation",
  description: "Schedule of weekly champion rotation",
  async execute(message, args) {
    try {
      const response = await axios.get(
        `https://br1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${riotAPIToken}`
      );
      const freeWeekIds = response.data.freeChampionIds;
      const championsResponse = await axios.get(
        `http://ddragon.leagueoflegends.com/cdn/9.19.1/data/pt_BR/champion.json`
      );
      const championsInfo = Object.values(championsResponse.data.data);

      const getChampionInfo = (id) => {
        return championsInfo.find((champion) => champion.key === String(id));
      };

      freeWeekIds.forEach((id) => {
        const champion = getChampionInfo(id);
        const embed = new Discord.MessageEmbed()
          .setThumbnail(
            `https://cdn.communitydragon.org/latest/champion/${id}/square.png`
          )
          .addField("Champion", champion.name)
          .addField("Roles", champion.tags.join(", "));

        message.channel.send(embed);
      });
    } catch (error) {
      console.error(error);
    }
  },
};

const axios = require('axios')
const discord = require('discord.js')
const userData = require('./userData')
const UserData = new userData()
module.exports = class Spotlight {
	constructor() {}
	async getChampionData(championName) {
		const champion =
			championName.charAt(0).toUpperCase() + championName.slice(1)
		const patch = await UserData.getCurrentPatch()
		const { data: championData } = await axios.get(
			`http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${champion}.json`
		)
		return { championData, patch, champion }
	}
	async isChampionExist(name) {
		try {
			const patch = await UserData.getCurrentPatch()
			const champion = name.charAt(0).toUpperCase() + name.slice(1)
			const { data: championData } = await axios.get(
				`http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${champion}.json`
			)
			return true
		} catch (err) {
			if (err.message.includes('403')) {
				throw new Error(
					`I can't find any champion with the name of \`${name}\``
				)
			}
		}
	}
}

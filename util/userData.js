const axios = require('axios')
const moment = require('moment')
const emoji = require('./emojiHandler')
class UserData {
	constructor(region, username) {
		this.base_url = `https://${UserData.Region(region)}.api.riotgames.com/lol`
		this.username = username
	}
	static Region(region) {
		if (region == 'ru' || region == 'kr') {
			return region
		} else if (region == 'lan') {
			return 'la1'
		} else {
			return region + 1
		}
	}
	async profileBasicData(message) {
		try {
			const url = `${this.base_url}/summoner/v4/summoners/by-name/${this.username}?api_key=${process.env.TOKEN_LOL}`
			const { data: basicData } = await axios.get(url)
			return basicData
		} catch (err) {
			console.log(err)
			if (err.response.status == 404) {
				throw new Error('This user does not exist in the current region')
			} else {
				throw new Error('An error has occurred while trying to fetch user data')
			}
		}
	}
	async getCurrentPatch() {
		const url = `https://ddragon.leagueoflegends.com/api/versions.json`
		const { data } = await axios.get(url)
		return data[0]
	}
	async getChampionById(id) {
		const patch = await this.getCurrentPatch()
		const url = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`
		const { data: response } = await axios.get(url)
		let champion = []
		const champions = Object.keys(response.data)
		champions.forEach(champ => {
			if (response.data[champ].key == id) {
				champion.push(response.data[champ])
			}
		})
		return champion[0]
	}
	async getChampionByName(name) {
		const patch = await this.getCurrentPatch()
		const championName = new RegExp(name, 'gis')
		const url = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`
		const { data: response } = await axios.get(url)
		let champion = []
		const champions = Object.keys(response.data)
		champions.forEach(champ => {
			if (response.data[champ].name.match(championName)) {
				champion.push(response.data[champ])
			}
		})
		return champion[0]
	}
	async advencedMatchInfo(gameId) {
		const url = `${this.base_url}/match/v4/matches/${gameId}?api_key=${process.env.TOKEN_LOL}`
		const { data: match } = await axios.get(url)
		return match
	}

	async mostPlayedChampions(summonerId, patch, message) {
		try {
			const url_mostPlayedChampions = `${this.base_url}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${process.env.TOKEN_LOL}`
			const { data } = await axios.get(url_mostPlayedChampions)
			const mostPlayedChampions = data.slice(0, 3)
			return Promise.all(
				mostPlayedChampions.map(async champion => {
					const { championId, championLevel, championPoints } = champion
					const { image, name } = await this.getChampionById(championId)
					// const emoji = new Emoji(name, message.guild.id, image, patch);
					return {
						name,
						points: championPoints,
						level: championLevel,
					}
				})
			)
		} catch (err) {
			console.log(err)
			throw new Error(
				'An error has occurred while trying to fetch most played champions.'
			)
		}
	}
	async rankedInfo(summonerId) {
		try {
			const urlRanked = `${this.base_url}/league/v4/entries/by-summoner/${summonerId}?api_key=${process.env.TOKEN_LOL}`
			// console.log(urlRanked)
			const { data: rankedData } = await axios.get(urlRanked)
			let data = []
			rankedData.forEach(item => {
				if (item.queueType == 'RANKED_SOLO_5x5') {
					data.solo = []
					const { tier, rank, leaguePoints, wins, losses, queueType } = item
					data.solo.push({ tier, rank, leaguePoints, wins, losses, queueType })
				} else if (item.queueType == 'RANKED_FLEX_SR') {
					data.flex = []
					const { tier, rank, leaguePoints, wins, losses, queueType } = item
					data.flex.push({ tier, rank, leaguePoints, wins, losses, queueType })
				}
			})
			return data
		} catch (err) {
			console.log(err)
			throw new Error(
				'An error has occurred while trying to fetch ranked data.'
			)
		}
	}
	async getQueueById(queueId) {
		const urlQueues =
			'http://static.developer.riotgames.com/docs/lol/queues.json'
		const { data } = await axios.get(urlQueues)
		const queue = data.filter(q => q.queueId == queueId)
		return queue[0]
	}
	async getCurrentMatch(id) {
		try {
			// /spectator/v4/active-games/by-summoner/${id}
			const urlCurrentMatch = `${this.base_url}/spectator/v4/active-games/by-summoner/${id}?api_key=${process.env.TOKEN_LOL}`
			const { data: match } = await axios.get(urlCurrentMatch)
			const data = []
			data.userTeam = []
			data.enemyTeam = []
			data.gameMode = match.gameMode
			for (let i = 0; i < match.participants.length; i++) {
				const user = match.participants[i]
				if (user.teamId == 100) {
					const { summonerName, championId } = user
					const champion = await this.getChampionById(championId)
					data.userTeam.push({ summonerName, championName: champion.name })
				}
				if (user.teamId == 200) {
					const { summonerName, championId } = user
					const champion = await this.getChampionById(championId)
					data.enemyTeam.push({ summonerName, championName: champion.name })
				}
			}
			return data
		} catch (err) {
			if (err.response.status == 404) {
				return false
			} else {
				console.log(err)
			}
		}
	}
	async lastMatch(message) {
		try {
			const patch = await this.getCurrentPatch()
			const { accountId } = await this.profileBasicData()
			const url_lastMatch = `${this.base_url}/match/v4/matchlists/by-account/${accountId}?endIndex=1&beginIndex=0&api_key=${process.env.TOKEN_LOL}`
			const { data: lastPlayedMatch } = await axios.get(url_lastMatch)
			const { gameId, timestamp } = lastPlayedMatch.matches[0]
			const date = new Date(timestamp) //convert timestamp to normal date
			const time = moment(date, 'YYYYMMDD').fromNow()
			const { name: championName, image } = await this.getChampionById(
				lastPlayedMatch.matches[0].champion
			)
			const emojisHandler = new emoji(
				image,
				patch,
				championName,
				message.guild.id
			)
			const {
				gameMode,
				participantIdentities,
				participants,
				queueId,
			} = await this.advencedMatchInfo(gameId)
			let { map, description: mode } = await this.getQueueById(queueId)
			let currentPlayerId = null
			const currentPlayerSum = []
			const data = []
			participantIdentities.forEach(participant => {
				if (participant.player.currentAccountId === accountId) {
					currentPlayerId = participant.participantId
				}
			})
			participants.forEach(participant => {
				if (participant.participantId === currentPlayerId) {
					currentPlayerSum.push(participant)
				}
			})
			const {
				win,
				kills,
				deaths,
				assists,
				totalMinionsKilled,
				neutralMinionsKilled,
			} = currentPlayerSum[0].stats
			const { role, lane } = currentPlayerSum[0].timeline
			data.push({
				patch: patch,
				time,
				map,
				mode,
				emojisHandler: emojisHandler,
				stats: {
					win,
					kills,
					deaths,
					assists,
					totalMinionsKilled,
					neutralMinionsKilled,
					role,
					lane,
					gameMode,
					champion: { name: championName, image },
				},
			})
			return data
		} catch (err) {
			console.log(err)
			throw new Error(err.message)
		}
	}
}
module.exports = UserData

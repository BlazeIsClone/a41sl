const UserData = require('./userData')
const Discord = require('discord.js')
const points = require('./pointsChanges')
const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
	connectionString,
})
const Points = new points()
class Profile {
	constructor() {}
	async setUser(message) {
		const messageContent = message.content
		const summoner = Profile.extractData(messageContent)
		let rows = await new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM users WHERE userid = '${message.author.id}'`,
				(err, res) => {
					resolve(res.rows)
				}
			)
		})
		if (!rows[0] && summoner.name != '?setUser' && summoner.region != null) {
			pool.query(
				`INSERT INTO Users (username , region , userid) VALUES ('${summoner.name}' , '${summoner.region}' , ${message.author.id});`
			)
			message.channel.send('summoner has been successfully registered!')
		} else {
			message.channel.send(
				'Something went wrong, if you are trying to update summoner data, Use ``?updateUser [summoner name] [summoner region] to change the current summoner informations``.'
			)
		}
	}
	static async getSummoner(userId) {
		const rows = await new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM users WHERE userid = '${userId}'`,
				(err, res) => {
					resolve(res.rows)
				}
			)
		})
		if (!rows[0]) {
			return false
		} else {
			return rows
		}
	}
	static extractData(data) {
		if (data.includes('"')) {
			// const name = data.match(/"(.*?)"/g)[0].replace(/"/g, '')
			let [command, name, region] = data.split('"')
			region = region.trim()
			return { name, region }
		} else {
			let [command, name, region] = data.split(' ')
			return { name, region }
		}
	}
	async updateUser(message) {
		const messageContent = message.content
		const summoner = Profile.extractData(messageContent)
		const rows = await new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM users WHERE userid = '${message.author.id}'`,
				(err, res) => {
					resolve(res.rows)
				}
			)
		})
		if (!rows[0]) {
			message.channel.send(
				'Make sure to set the user first ``?setUser [summoner name] [summoner region]``. '
			)
		} else if (summoner.name != '?updateUser' && summoner.name != null) {
			pool.query(
				`UPDATE users SET username= '${summoner.name}' , region ='${summoner.region}'  WHERE userid='${message.author.id}' `
			)
			message.channel.send('summoner data has been updated!')
		} else {
			message.channel.send('Check your inputs and try again!')
		}
	}

	async getData(message, client) {
		try {
			const getSummoner = await Profile.getSummoner(message.author.id)
			if (getSummoner) {
				const { username, region } = getSummoner[0]
				const userData = new UserData(region, username)
				const {
					summonerLevel,
					name: summonerName,
					profileIconId,
					id: summonerId,
				} = await userData.profileBasicData()
				const lastMatch = await userData.lastMatch(message)
				const { patch, time, mode, map, emojisHandler } = lastMatch[0]
				const {
					win,
					kills,
					deaths,
					assists,
					totalMinionsKilled,
					neutralMinionsKilled,
					lane,
					role,
				} = lastMatch[0].stats
				const {
					name: championName,
					image: championImages,
				} = lastMatch[0].stats.champion
				const mostPlayedChampions = await userData.mostPlayedChampions(
					summonerId,
					patch,
					message
				)
				const rankedInfo = await userData.rankedInfo(summonerId)
				const currentMatch = await userData.getCurrentMatch(summonerId)
				const uploadEmoji = await emojisHandler.upload()
				const lastMatchChampionEmoji = await message.guild.emojis.find(
					emoji => emoji.name == championName
				)
				const messageStyles = new Discord.RichEmbed()
					.setColor('#e74c3c')
					.setTitle(`${username} Profile`)
					.setThumbnail(
						`http://ddragon.leagueoflegends.com/cdn/${patch}/img/profileicon/${profileIconId}.png`
					)
					.addField(
						'Last Played Match',
						` \`${map} | ${mode}\` \n
						${win ? ':green_circle:' : ':red_circle:'} ${
							deaths == 0 && kills > 1 ? ', ``' + 'PERFECT KDA' + '``' : ''
						} ${role == 'NONE' ? '' : role} ${lane} as ${championName +
							' ' +
							lastMatchChampionEmoji} with **${kills}/${deaths}/${assists}** and **${totalMinionsKilled +
							neutralMinionsKilled}CS** ${time}`,
						true
					)
					.addField('Level / region', `${summonerLevel} / ${region}`, true)
					.addBlankField()
					.addField(
						`Highest Champions Mastery`,
						`
						${
							mostPlayedChampions.length > 1
								? mostPlayedChampions
										.map((champ, index) => {
											const data = `[${index + 1}] ${champ.name} - ${
												champ.points
											}pts \n `
											return data
										})
										.join('')
								: 'no mastery champions'
						}
						`,
						true
					)
					.addField(
						`Summoner Rank`,
						`\`Flex\`\n ${
							rankedInfo.flex
								? `Tier : ${rankedInfo.flex[0].tier} \n Rank : ${rankedInfo.flex[0].rank} \n Points : ${rankedInfo.flex[0].leaguePoints} \n Wins : ${rankedInfo.flex[0].wins}  \n Losses : ${rankedInfo.flex[0].losses}   `
								: 'No Flex Data'
						}
						\`Solo\` \n ${
							rankedInfo.solo
								? `Tier : ${rankedInfo.solo[0].tier} \n Rank : ${rankedInfo.solo[0].rank} \n Points : ${rankedInfo.solo[0].leaguePoints} \n Wins : ${rankedInfo.solo[0].wins}  \n Losses : ${rankedInfo.solo[0].losses}`
								: 'No Solo/Duo Data'
						}
						`,
						// `${
						// 	rankedInfo
						// 		? `Tier : ${rankedInfo.tier} \n Rank : ${rankedInfo.rank} \n Points : ${rankedInfo.leaguePoints} \n Wins : ${rankedInfo.wins} \n Losses : ${rankedInfo.losses}`
						// 		: 'Unranked'
						// }`,
						true
					)
					.addField(
						`Current Match`,
						`${
							currentMatch
								? `${currentMatch.userTeam
										.map(
											user =>
												`${
													user.summonerName == summonerName
														? '``' + user.summonerName + '``'
														: user.summonerName
												} | ${user.championName} \n`
										)
										.join('')} 
								   ___Vs___
								    \n ${currentMatch.enemyTeam
											.map(
												user =>
													`${
														user.summonerName == summonerName
															? '``' + user.summonerName + '``'
															: user.summonerName
													} | ${user.championName} \n`
											)
											.join('')}`
								: 'This player is not playing right now.'
						}`
					)
					.setFooter(
						`Developed with love by Everkers#6416`,
						'https://i.pinimg.com/236x/f0/10/b2/f010b2798bfaa02c4afd72cb2aef6bfc.jpg'
					)
				const sendMsg = await message.channel.send(messageStyles)
				const deleteLastMatchEmoji = await emojisHandler.delete(
					lastMatchChampionEmoji.id
				)
				Points.setPoints = { msg: message, amount: 2 }
			} else {
				message.channel.send(
					'Try to set user first ``?setUser [summoner name] [summoner region]`` '
				)
			}
		} catch (err) {
			console.log(err)
		}
	}
}
module.exports = Profile

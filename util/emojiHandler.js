const fetch = require('node-fetch')
class EmojiHandler {
	constructor(image, patch, name, guildId) {
		this.image = `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${image.full}`
		this.name = name
		this.guideId = guildId
		this.url = `https://discordapp.com/api/guilds/${guildId}/emojis`
	}
	upload() {
		const up = new Promise(async (resolve, reject) => {
			try {
				const base = await this.imageTobase64()
				let body = {
					name: this.name.split(' ')[0],
					image: base,
				}
				const response = await fetch(this.url, {
					method: 'post',
					body: JSON.stringify(body),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bot ${process.env.TOKEN_BOT}`,
					},
				})
				resolve(true)
			} catch (err) {
				console.log(err)
				reject(false)
			}
		})
		return up
	}
	delete(emojiId) {
		const dl = new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${this.url}/${emojiId}`, {
					method: 'delete',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bot ${process.env.TOKEN_BOT}`,
					},
				})
				resolve(true)
			} catch (err) {
				console.log(err)
				reject(false)
			}
		})
		return dl
	}
	async imageTobase64() {
		if (!this.image) {
			throw new Error('please add an image url and try again')
		} else {
			const response = await fetch(this.image)
			const buffer = await response.buffer()
			const base64 = `data:image/png;base64,${buffer.toString('base64')}`
			return base64
		}
	}
}
module.exports = EmojiHandler

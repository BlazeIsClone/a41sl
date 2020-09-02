const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
	connectionString,
})
class Points {
	constructor(tmpId) {
		this.id = null
		this.points = null
		this.tmpId = tmpId
	}
	updated(msg) {
		if (this.points == 100) {
			msg.channel.send(
				` \`congratulations you got ${this.points}gp \`:confetti_ball: `
			)
		} else if (this.points == 200) {
			msg.channel.send(
				` \`congratulations ${msg.author.username} you got ${this.points}gp \`:confetti_ball: `
			)
		} else if (this.points == 300) {
			msg.channel.send(
				` \`congratulations ${msg.author.username} you got ${this.points}gp \`:confetti_ball: `
			)
		} else if (this.points == 50) {
			msg.channel.send(
				` \`congratulations ${msg.author.username} you got ${this.points}gp \`:confetti_ball: `
			)
		}
	}
	async isExist(userId) {
		try {
			const data = await new Promise((resolve, reject) => {
				pool.query(
					`SELECT * FROM users WHERE userid = '${userId}'`,
					(err, res) => {
						resolve(res.rows)
					}
				)
			})
			if (data[0] == undefined) {
				return false
			} else {
				return true
			}
		} catch (err) {
			console.log(err)
		}
	}
	get getPoints() {
		return (async () => {
			try {
				const data = await new Promise((resolve, reject) => {
					pool.query(
						`SELECT points FROM users WHERE userid = '${
							this.id == null ? this.tmpId : this.id
						}'`,
						(err, res) => {
							if (res.rows.length < 1 || res.rows[0].points == null) {
								resolve(null)
							} else {
								resolve(res.rows)
							}
						}
					)
				})
				if (data == null) {
					return 0
				} else {
					return data[0].points
				}
			} catch (err) {
				console.log(err)
			}
		})()
	}
	set setPoints(data) {
		;(async () => {
			try {
				let { msg, amount } = data
				const userId = msg.author.id
				amount = parseInt(amount)
				const isExist = await this.isExist(userId)
				if (isExist) {
					this.id = userId
					const current = await this.getPoints
					const add = await new Promise((resolve, reject) => {
						pool.query(
							`UPDATE users SET points = ${current +
								amount} WHERE userid = '${userId}'`
						)
						resolve()
					})

					this.points = current + amount
					this.updated(msg)
				}
			} catch (err) {
				console.log(err)
			}
		})()
	}
}

module.exports = Points

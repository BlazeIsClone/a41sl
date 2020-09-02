const Points = require('./pointsChanges')
module.exports = class Admin {
	isAdmin(id) {
		if (id == process.env.ADMINID) {
			return true
		} else {
			return false
		}
	}
	updatePoints(msg, amount) {
		try {
			const points = new Points()
			points.setPoints = { msg, amount }
			msg.reply(`Added ${amount} to your gp`)
		} catch (err) {
			console.log(err)
			msg.reply('sorry someting goes wrong!')
		}
	}
}

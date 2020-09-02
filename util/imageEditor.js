const axios = require('axios')
const points = require('./pointsChanges')
class ImageEditor {
	async uploadImage(message) {
		try {
			const imageUrl = message.author.avatarURL
			const msg = message.content
			const authorId = message.author.id
			const Points = new points(authorId)
			const gp = await Points.getPoints
			const [command, overlay] = msg.split(' ')
			if (overlay == undefined) {
				message.channel.send(
					'Please add a border number! \n ``Type ?borders to see the available borders``'
				)
			}
			if ((overlay == 2 && gp < 200) || (overlay == 1 && gp < 50)) {
				message.channel.send(
					`You can't use this border, you don't have enough gp \n \`tip:use bot = earn gp \``
				)
			} else if (overlay == 2 && gp >= 200) {
				console.log('uploading')
				const { data: image } = await axios.get(
					`https://league-fire-b.herokuapp.com/imageUpload?url=${imageUrl}&overlay=${overlay}`
				)
				const { url: editedImageUrl, id } = image
				const sendImage = await message.channel.send('BINGO!:heart:', {
					files: [editedImageUrl],
				})
				ImageEditor.deleteImage(id)
			} else if (overlay == 1 && gp >= 50) {
				const { data: image } = await axios.get(
					`https://league-fire-b.herokuapp.com/imageUpload?url=${imageUrl}&overlay=${overlay}`
				)
				const { url: editedImageUrl, id } = image
				const sendImage = await message.channel.send('BINGO!:heart:', {
					files: [editedImageUrl],
				})
				ImageEditor.deleteImage(id)
			}
		} catch (err) {
			console.log(err)
			message.channel.send(
				'An error has occurred while trying to edit your image'
			)
		}
	}
	static async deleteImage(id) {
		try {
			const { data: remove } = await axios.get(
				`https://league-fire-b.herokuapp.com/imageDelete/${id}`
			)
		} catch (err) {
			console.log(err)
		}
	}
}
module.exports = ImageEditor

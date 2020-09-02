const axios = require('axios')
const Discord = require('discord.js')
const UserData = require('./userData')
const points = require('./pointsChanges')
const Points = new points()
class Champion {
	async getData(message) {
		const messageContent = message.content
		const [championName] = messageContent
			.substr(messageContent.indexOf(' ') + 1)
			.split(' ')
		if (championName == '?champion') {
			message.channel.send('type a champion name')
		} else {
			const userData = new UserData()
			const patch = await userData.getCurrentPatch()
			const { image } = await userData.getChampionByName(championName)
			const championImage = `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${image.full}`
			const { data: championData } = await axios.get(
				`https://league-fire-b.herokuapp.com/champion/${championName}`
			)
			const arr = []
			const data = Object.keys(championData.data)
			for (const key of data) {
				arr.push(championData.data[key])
			}
			arr.forEach(elm => {
				if (elm.hasOwnProperty('guide')) {
					elm.guide = elm.guide.replace(
						/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
						''
					)
				}
			})
			let runes = Object.keys(arr[2].data)
			const dataRunes = [{ primary: [], secondary: [], third: [] }]
			for (const key of runes) {
				const trees = arr[2].data[key]
				if (key == 'primary') {
					trees.map((tree, i) => {
						const x = tree.replace(
							/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
							''
						)
						dataRunes[0].primary.push(x)
					})
				} else if (key == 'secondary') {
					trees.map((tree, i) => {
						const x = tree.replace(
							/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
							''
						)
						dataRunes[0].secondary.push(x)
					})
				} else if (key == 'third') {
					trees.map((tree, i) => {
						const x = tree.replace(
							/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/gi,
							''
						)
						dataRunes[0].third.push(x)
					})
				}
			}
			const messageStyles = new Discord.RichEmbed()
				.setColor('#e74c3c')
				.setTitle(`${arr[0]}`)
				.setThumbnail(championImage)
				.addField(
					`Best Items for ${arr[0]} `,
					`${arr[1].guide} \n \n ${arr[1].items
						.map((item, i) => `[${i + 1}] ${item} \n`)
						.join('')}`,
					true
				)
				.addField(
					`Best Runes for ${arr[0]}`,
					`${arr[2].guide} \n \n Primary Tree \n ${dataRunes[0].primary
						.map((rune, i) => `[${i + 1}] ${rune}\n`)
						.join('')} \n Secondary Tree\n ${dataRunes[0].secondary
						.map((rune, i) => `[${i + 1}] ${rune}\n`)
						.join('')} \nThird Tree\n  ${dataRunes[0].third
						.map((rune, i) => `[${i + 1}] ${rune}\n`)
						.join('')} `
				)
				.addField(
					'Skill Order',
					`${arr[3].guide}\n \n  ${arr[3].order.map((item, i) => {
						return `${Object.keys(item)} : ${Object.values(item)}   `
					})} `
				)
				.setFooter(
					`Developed with love by Everkers#6416`,
					'https://i.pinimg.com/236x/f0/10/b2/f010b2798bfaa02c4afd72cb2aef6bfc.jpg'
				)

			message.channel.send(messageStyles)
			Points.setPoints = { msg: message, amount: 2 }
		}
	}
}
module.exports = Champion

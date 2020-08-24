module.exports = {
	//? Discord -
	discord: {
		//? App Token - https://discordapp.com/developers/applications
		token: '',
		//? Notification Channel ID -
		channel_id: '741953686023962735'
	},

	//? Twitch -
	twitch: {
		//? Twitch Client ID - https://dev.twitch.tv/console/apps/create
		client_id: 'process.env.TWITCH_CLIENT_ID',
		//? Name of streamer
		streamer: 'moonbtw',
		//? Color on embed - default #9147FF
		embed_color: '#9147FF',
		//? Stream online message - default "{STREAMER} is now online!"
		live_message: '{STREAMER} is now online!',
		//? Stream offline message - default "{STREAMER} is now offline!"
		offline_message: '{STREAMER} is now offline!'
	}
};

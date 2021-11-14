const { Client, Collection } = require('discord.js');

require('dotenv').config();

const EventHandler = require('@utils/loadEvents');

const { DISCORD_TOKEN } = process.env;

module.exports = class ClientManager extends Client {
	constructor(options) {
		super(options);
		this.commands = new Collection();
		this.aliases = new Collection();
	}

	setup() {
		this.events = new EventHandler(this);
		this.events.init();
		// eslint-disable-next-line global-require
		require('@utils/loadCommands')(this);
		this.login(DISCORD_TOKEN);
	}
};

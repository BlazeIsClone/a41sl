require('dotenv').config();
const { Client, Collection } = require('discord.js');
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
		require('@utils/loadCommands')(this);
		this.login(DISCORD_TOKEN);
	}
};

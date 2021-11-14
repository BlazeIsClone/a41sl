require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { eventHandler, loadCommands } = require('@utils');

const { DISCORD_TOKEN } = process.env;

/**
 * Custom discord client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class ClientManager extends Client {
	constructor(options) {
		super(options);
		this.commands = new Collection();
		this.aliases = new Collection();
	}

	setup() {
		eventHandler(this);
		loadCommands(this);
		this.login(DISCORD_TOKEN);
	}
};

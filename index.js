require('module-alias/register');

const ClientManager = require('@src/ClientManager');

const client = new ClientManager({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: 32767,
	disableMentions: 'everyone',
});

client.setup();

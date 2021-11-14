const fs = require('fs');

const eventHandler = client => {
	const files = fs
		.readdirSync('./src/events')
		.filter(x => x.endsWith('.js'));

	for (const file of files) {
		const event = require(`@events/${file}`);
		const name = file.split('.')[0];
		client.on(name, event.bind(null, client));
	}
};

module.exports = eventHandler;

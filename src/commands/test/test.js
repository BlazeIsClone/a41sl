module.exports.run = async (client, message, args) => {
	message.channel.send('Test Passed!');
};

module.exports.config = {
	name: 'test',
	aliases: [],
};

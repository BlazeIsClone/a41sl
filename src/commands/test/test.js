module.exports.run = async (client, message, args) => {
  message.channel.send("Test cmd.");
};

module.exports.config = {
  name: "test",
  aliases: [],
};

/**
 * Returns a unique discriminator string that can be used to distinguish between custom emojis.
 * @param {Object} emoji The emoji used as the reaction to the message.
 * @returns {String} The discriminator.
 */
function getEmojiDiscriminator(emoji) {
	if (emoji.id) {
		return `${emoji.name}:${emoji.id}`;
	} else {
		return emoji.name;
	}
}

/**
 * Fetches all messages that need to be tracked into the cache. Makes sure each message is having the proper reactions attached.
 * @param {*} client The bot client.
 * @param {*} config The config file.
 */
module.exports = function(client, config) {
	
	client

		.on("messageReactionAdd", (messageReaction, user) => {
			//Bot should not react to its own reactions
			if (user == client.user) return;
			var member = messageReaction.message.guild.members.get(user.id);
			var emojiDiscriminator = getEmojiDiscriminator(messageReaction.emoji);
			(async () => {
				for (var { channel, reactions, disjoint } of config) {
					if (channel != messageReaction.message.channel.id) continue;
					var rolesNew = [];
					for(var role of member.roles.keys()){
						rolesNew.push(role);
					}
					var rolesWhitelist = [];
					var rolesBlacklist = [];
					for (var { emoji, roles } of reactions) {
						if (emojiDiscriminator == emoji) {
							rolesWhitelist.push.apply(rolesWhitelist, roles); //Prototyping the push function, might be buggy
						}
						rolesBlacklist.push.apply(rolesBlacklist, roles);
					}
					//Check to see if roles are handled mutually eclusive
					if (disjoint) {
						rolesNew = rolesNew.filter((role) =>
							//Remove role if found on watchlist
							(!rolesBlacklist.includes(role))
						);
					}
					rolesNew.push.apply(rolesNew, rolesWhitelist);
					//Make sure none of the roles on the "add" list get removed again
					await member.setRoles(rolesNew)
						.catch(error => console.error(error));
					if (disjoint) await messageReaction.remove(user)
						.catch(error => console.error(error));
				}
			})();
		})

		.on("messageReactionRemove", (messageReaction, user) => {
			//Bot should not react to its own reactions.
			if (user == client.user) return;
			var member = messageReaction.message.guild.members.get(user.id);
			var emojiDiscriminator = getEmojiDiscriminator(messageReaction.emoji);
			(async () => {
				for (var { disjoint, channel, reactions } of config) {
					//Make sure we're not in "disjoint" mode
					if (disjoint) continue;
					if (channel != messageReaction.message.channel.id) continue;
					var rolesToKeep = [];
					var rolesToRemove = [];
					for (var { emoji, roles } of reactions) {
						if (emojiDiscriminator == emoji) {
							//Add to removal list
							rolesToRemove.push.apply(rolesToRemove, roles);
						} else {
							//List of all other roles that should be kept
							rolesToKeep.push.apply(rolesToKeep, roles);
						}
					}
					rolesToRemove.filter((role) =>
						//Make sure role that is about to be removed is not part of another emoji
						(!rolesToKeep.includes(role)) &&
						//Make sure member actually has role
						(member.roles.get(role))
					);
					await member.removeRoles(rolesToRemove)
						.catch(error => console.error(error));
				}
			})();
		});

};

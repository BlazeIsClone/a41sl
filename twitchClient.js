const request = require("request");
const Twitch = require("twitch-js").default;
var streamerName = "tfue";
const username = "foo";

const twitchToken = process.env.TWITCH_CLIENT_SECRET;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const { api } = new Twitch({ twitchToken, username });

function streamNameToUserId(streamerName) {
    var requestUrl = `https://api.twitch.tv/helix/users?login=${streamerName}`;
    var options = getRequestOptions(requestUrl);

    request(options, (error, response, body) => {
        if (response.statusCode == 200) {
            var user = JSON.parse(body);
            console.log(`Successfully found ${user.display_name}`);
            return user.id;
        }
        console.log("Unable to find streamer");
        return -1; //Dummy value to say we couldn't find a userID
    });
}

function isStreaming(streamerName) {
    var userId = streamNameToUserId(streamerName);
    var requestUrl = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
    var options = getRequestOptions(requestUrl);

    request(options, (err, res, body) => {
        if (response.statusCode == 200) {
            var userStreams = JSON.parse(body);
            if (userStreams.data.size > 0) {
                return true;
            }
        }
        return false;
    });
}

function getRequestOptions(url) {
    return {
        url: url,
        headers: {
            "Client-ID": `${twitchClientId}`,
            Authorization: `Bearer ${twitchToken}`
        }
    };
}

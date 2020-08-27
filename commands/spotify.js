var spotify = require("../config.js");
const moment = require("moment");

var spotifyApi = spotify.spotifyApi;
var embed = null;

exports.run = (client, message, args) => {
    embed = getDefault(client);
    if (args[0] === "album") {
        var input = args.splice(1).join(" ");
        spotifyApi.searchAlbums(input).then(
            data => {
                data.body.albums.items.forEach(item => {
                    embed["fields"].push({
                        name: item.artists[0].name,
                        value: `[${item.name}](${item.external_urls.spotify})`
                    });
                });
                message.channel.send({ embed });
            },
            err => {
                console.error(err);
            }
        );
    } else if (args[0] === "track") {
        var input = args.splice(1).join(" ");
        spotifyApi.searchTracks(input).then(
            data => {
                data.body.tracks.items.forEach(item => {
                    embed["fields"].push({
                        name: item.artists[0].name,
                        value: `[${item.name}](${item.external_urls.spotify})`
                    });
                });
                message.channel.send({ embed });
            },
            err => {
                console.error(err);
            }
        );
    } else if (args[0] === "artist") {
        var input = args.splice(1).join(" ");
        spotifyApi.searchArtists(input, { limit: 5 }).then(
            data => {
                data.body.artists.items.forEach(item => {
                    console.log(item);
                    message.channel.send(item.external_urls.spotify);
                });
            },
            err => {
                console.error(err);
            }
        );
    }
};

exports.help = {
    name: "!spotify <command> <track/artist/album>",
    value:
        "Use spotify function inside discord! \n\nAvailable command:\n" +
        "```fix\nalbum\ntrack\nartist```"
};

function getDefault(client) {
    return (embed = {
        color: 14470972,
        timestamp: moment().format(),
        fields: []
    });
}

//Spotify
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/callback"
});

spotifyApi.clientCredentialsGrant().then(
    data => {
        console.log("The access token is " + data.body["access_token"]);
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    err => {
        console.log("Something went wrong!", err);
    }
);

exports.spotifyApi = spotifyApi;

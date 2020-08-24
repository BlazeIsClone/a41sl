const { twitch } = require("../config");
const fetch = require("node-fetch");

//? Simple function to call Twitch API -
const get = async url => {
    try {
        const req = await fetch(url, {
            headers: { "Client-ID": twitch.client_id }
        });

        const res = await req.json();

        return res.data.length ? res.data[0] : null;
    } catch (error) {
        return console.error(error);
    }
};

//? I could do all of this in the same file but I might use these functions elsewhere in the future -

//? User
const getUser = async user => {
    return await get(`https://api.twitch.tv/helix/users?login=${user}`);
};
//? Stream
const getStream = async user => {
    return await get(`https://api.twitch.tv/helix/streams?user_login=${user}`);
};
//? Game
const getGame = async id => {
    return await get(`https://api.twitch.tv/helix/games?id=${id}`);
};

module.exports = { get, getUser, getStream, getGame };

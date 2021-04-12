<img src="https://media.giphy.com/media/kU0et9AnjV2PrWTkS7/giphy.gif"/>

# **All For One Bot**

All For One Bot is an open source solution for your discord server management and entertainment. My goal is to cover as many functionalities and niches as possible, while still maintaining usability and code readability. Currently the bot can stream music from YouTube, SoundCloud and Spotify.

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/BlazeIsClone/A41SLBOT/commits/master)
[![Generic badge](https://img.shields.io/badge/Instructions-wiki-<COLOR>.svg)](https://github.com/BlazeIsClone/A41SLBOT/wiki/)
[![GPL license](https://img.shields.io/badge/License-GPL-blue.svg)](https://github.com/BlazeIsClone/A41SLBOT/blob/master/LICENSE.txt)

<hr>

## 📥 Installation

For self hosting clone this repository

```bash
git clone https://github.com/BlazeIsClone/A41SLBOT.git
```


## ⚙️ Configuration

⚠ Never share your tokens or api keys publicly 

Modify `config.json` and fill out the values:

```json
{
  "MAX_PLAYLIST_SIZE": 500,
  "PREFIX": "/",
  "musicChannelOne": "text-channel-id",
  "musicChannelTwo": null,
  "musicChannelErrorResponse": "Music commands are only available in **add-music** channel",
  "nsfwPrefix": "/nsfw",
  "serverManager": "user-id",
  "serverOwner": "user-id",
  "guildId": "server-id",
  "welcomeChannel": "text-channel-name",
  "goodbyeChannel": "text-channel-name",
  "auditLogChannel": "text-channel-name",
  "memesChannel": "text-channel-id",
  "memberCountChannelId": "text-channel-id",
  "STAY_TIME": 30
}
```
For API Tokens Rename `.env.example` to `.env` and fill out the values:

```markdown
DISCORD_TOKEN=
YOUTUBE_API_KEY=
SOUNDCLOUD_CLIENT_ID=
ANNOUNCEMENTS_WEBHOOK_URL=
SPOTIFY_CLIENT_ID=
SPOTIFY_SECRET_ID=
```
If you have any difficulties obtaining API tokens please refer
[📄 wiki](https://github.com/BlazeIsClone/A41SLBOT/wiki)

For Heroku hosting use the **config vars** feature.

## 👏 Contributor Covenant Code of Conduct

This project is currently under development and if you are planing to implement right now you might have to make minor adjustments to the code. In the future im planing to make intergration seamless and provide detailed documentation. If You run into any issues please feel free to let me know in the discussion or create a new issue.

All For One Bot is still on alpha stage contribution would be appreciated ❤️.

## ✉️ Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see
https://www.contributor-covenant.org/faq

## 💝 Credits
A special thanks to [eritislami/evobot](https://github.com/eritislami/evobot) for the music system/technology and [SharkSmile](https://github.com/sahaswin) for the amazing logo and inspiration.

## 📜 License [![GPL license](https://img.shields.io/badge/License-GPL-blue.svg)](https://github.com/BlazeIsClone/A41SLBOT/blob/master/LICENSE.txt)

[📄 GNU General Public License v3.0](https://github.com/BlazeIsClone/A41SLBOT/blob/master/LICENSE.txt)


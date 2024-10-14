![Node build](https://github.com/hoangvu12/megumin/actions/workflows/node.yml/badge.svg)
![Docker build](https://github.com/hoangvu12/megumin/actions/workflows/docker.yml/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# 🤖 Megumin (A fork of [EvoBot](https://github.com/eritislami/evobot))

> Megumin is a Discord Music Bot built with TypeScript, discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide)

## Why a seperate repository but not a fork?

I decided to create a separate repository because forks can't open issues. Also, I have plans to maintain and add more features.

## What's the difference from Megumin with EvoBot?

The main difference is that Megumin uses an [Invidious](https://github.com/iv-org/invidious) instance to make YouTube requests instead of relying on your own network, as the chance of getting blocked by YouTube is quite high

And more features such as:

- Clear command

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Enable 'Message Content Intent' in Discord Developer Portal
2. Node.js 16.11.0 or newer

## 🚀 Getting Started

```sh
git clone https://github.com/hoangvu12/megumin.git
cd megumin
npm install
```

After installation finishes follow configuration instructions then run `npm run start` to start the bot.

## ⚙️ Configuration

Copy or Rename `config.json.example` to `config.json` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "TOKEN": "",
  "MAX_PLAYLIST_SIZE": 10,
  "PRUNING": false,
  "LOCALE": "en",
  "DEFAULT_VOLUME": 100,
  "STAY_TIME": 30,
  "INVIDIOUS_BASE_URL": "",
  "USE_INVIDIOUS_PROXY": false
}
```

## ⚙️ Invidious Configuration

You can change the Invidious instance by updating the `INVIDIOUS_BASE_URL` in your configuration. You can either use [a public Invidious instance](https://docs.invidious.io/instances/) or [host your own](https://docs.invidious.io/installation/).

If you are having trouble streaming (the bot doesn't play audio), try setting `USE_INVIDIOUS_PROXY` to `true`.

## 🐬 Docker Configuration

For those who would prefer to use our [Docker container](https://hub.docker.com/repository/docker/hoangvudev12/megumin), you may provide values from `config.json` as environment variables.

```shell
docker run -e "TOKEN=<discord-token>" hoangvudev12/megumin
```

## 📝 Features & Commands

- 🎶 Play music from YouTube via url

`/play https://www.youtube.com/watch?v=GLvohMXgcBo`

- 🔎 Play music from YouTube via search query

`/play under the bridge red hot chili peppers`

- 🔎 Search and select music to play

`/search Pearl Jam`

- 📃 Play youtube playlists via url

`/playlist https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c`

- 🔎 Play youtube playlists via search query

`/playlist linkin park meteora`

- Clear all the queue (/clear)
- Now Playing (/nowplaying)
- Queue system (/queue)
- Loop / Repeat (/loop)
- Shuffle (/shuffle)
- Volume control (/volume)
- Lyrics (/lyrics)
- Pause (/pause)
- Resume (/resume)
- Skip (/skip)
- Skip to song # in queue (/skipto)
- Move a song in the queue (/move)
- Remove song # from queue (/remove)
- Show ping to Discord API (/ping)
- Show bot uptime (/uptime)
- Toggle pruning of bot messages (/pruning)
- Help (/help)
- Command Handler from [discordjs.guide](https://discordjs.guide/)
- Media Controls via Buttons

![buttons](https://i.imgur.com/67TGY0c.png)

## 🌎 Locales

Currently available locales are:

- English (en)
- Arabic (ar)
- Brazilian Portuguese (pt_br)
- Bulgarian (bg)
- Romanian (ro)
- Czech (cs)
- Dutch (nl)
- French (fr)
- German (de)
- Greek (el)
- Indonesian (id)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Minionese (mi)
- Persian (fa)
- Polish (pl)
- Russian (ru)
- Simplified Chinese (zh_cn)
- Singaporean Mandarin (zh_sg)
- Spanish (es)
- Swedish (sv)
- Traditional Chinese (zh_tw)
- Thai (th)
- Turkish (tr)
- Ukrainian (uk)
- Vietnamese (vi)
- Check [Contributing](#-contributing) if you wish to help add more languages!
- For languages please use [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) two letter format

## 🤝 Contributing

1. [Fork the repository](https://github.com/hoangvu12/megumin/fork)
2. Clone your fork: `git clone https://github.com/your-username/megumin.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Stage changes `git add .`
5. Commit your changes: `cz` OR `npm run commit` do not use `git commit`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

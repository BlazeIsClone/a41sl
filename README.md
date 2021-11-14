# ⤴ Migration to discord.js v13

Currently undergoing a rewrite to support the new discord API version 9!

## 🐳 Docker Configuration

For those who would prefer [Docker container](https://hub.docker.com/repository/docker), you may provide environment variables from `.env` file.

```shell
docker run --env-file .env --name a41slbot a41slbot:0.1
```

## Available Scripts

In the project directory, you can run:

```shell
$ npm start
```

Runs the server in the background with watch and restart until stopped.

```shell
$ npm stop
```

Closes the running server.

```shell
$ npm run dev
```

Runs the app in the development mode. The server will reload if you make edits.\
You will also see any erros errors in the console.


## Import Aliases

Use custom aliases for absolute import paths. (Eg: @commands)

## Environment Variables

Configure secret environment variables using .env file.

## 🌍 Overview
A project to learn how to construct an **Express API** that uses **PostgresSQL**. 

I'm following the excellent [tutorial on Smashing Magazine](https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/) by Chidi Orji.

## 👨‍💻 Local development

### Quick reference
- `npm run build`: Build /src, output in /build.
- `npm run start`: Start server from /build. Services like Heroku will auto run this script on deploy.
- `npm run dev`: Start server in dev mode.
- `npm run lint`: Runs eslint
- `npm run lintfix`: Runs eslint with `--fix` flag
- `npm run pretty`: Runs prettier
- `npm run test`: Run tests with mocha and reporting with nyc

### 🔌 Set up

```bash
$cp .env.example .env
```

Populate CONNECTION_STRING. In my case, I grabbed the DB connection string from ElephantSQL.

## 🚀 Deploy

The project is hosted on Heroku.

### Quick reference

- `git push heroku`: Deploy
- `heroku open`: Opens in browser
- `heroku run npm run TASK_NAME`: Run npm tasks on server
- `heroku logs --tail`: Real-time server logs


## 👷‍♀️ Architecture

### Database

Using a Postgres DB hosted by [ElephantSQL](https://www.elephantsql.com/). We connect to with with from Node using the [node-postgres](https://node-postgres.com/) lib. 

```bash
$ npm i --save pg
```

#### Pooling

In node-postgres, every query is executed by a client. _Connection pooling_ is a pattern of creating a pool of available connections and allowing multiple clients to share these connections.

This is useful when you have limited connections and lots of clients.

`models/pool.js` export a pool which we import when we want to access the db. 

```
import { pool } from './pool';

pool.query(...)
```

### Node

Server code is written in ES6 syntax which Node doesn't currently support. We add the follow dev dependencies to help:
 
- `@babel/cli`: To run: ./node_modules/.bin/babel
- `@babel/core`
- `@babel/node`: Works like node cli, but utilizes babel presets and plugins
- `@babel/plugin-transform-runtime`: Helps avoid duplication in output.
- `@babel/preset-env`
- `@babel/register`: Compiles files on the fly and is required by tests.
- `@babel/runtime`


### Templating

Uses **[EJS](https://ejs.co/)**.

```ejs
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>
```

### Testing

```bash
$ npm i --save-dev mocha chai sinon-chai supertest
```

- `mocha`: Test runner
- `chai`: Assertion library
- `sinon-chai`: Extends Chai's assertion library
- `supertest`: Makes HTTP calls to our API endpoints

Mocha looks for a `/test` folder by default. In there, if `hooks.js` exists, it will automatically run lifecycle methods specified in there.

### Code style

Enforced with **eslint** and **prettier**. Configured in `.eslintrc.json`. (Note: a value of [0] in the config turns off a rule)

```bash
$ npm i --save-dev eslint eslint-config-airbnb-base eslint-plugin-import prettier
```

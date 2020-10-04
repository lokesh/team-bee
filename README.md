# 🐝 Team Bee API

A Node Express API server hosted on Heroku that powers the Team Bee game.

The bulk of the decisions around this repo's architecture were made following the excellent [tutorial on Smashing Magazine](https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/) by Chidi Orji.

## 🛣 Routes

```
GET    /users
GET    /users/:id
GET    /puzzles?order_by=date&dir=desc&hide_future=true
POST   /puzzles
GET    /puzzles/:id
DELETE /puzzles/:id
GET    /puzzles/:id/users
GET    /puzzles/:id/users/:userId
POST   /puzzles/:id/users/:userId
PUT    /puzzles/:id/users/:userId
```

## 👨‍💻 Local development

### Quick reference
- `npm run prestart`: Build /src, output in /build.
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

Using a Postgres DB hosted by [ElephantSQL](https://www.elephantsql.com/). We connect to with with from Node using the [node-postgres](https://node-postgres.com/) lib. It's barebones and I would use something that provided a bigger abstraction next time.

```bash
$ npm i --save pg
```

Using [TablePlus](https://tableplus.com/) as a GUI has been great for building tables and seeding data.


#### Postgres

- Limit complex objects in a column of type JSON. When fetching on the client, which properties are set will be unknown.
- Use snake_casing. Postgres is picky about capital letters.
- When using arrays, be aware that depending on the type, the return format can be different. Eg. Using [char], returns {a,b,c}, with the curly braces included.

##### Pooling

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

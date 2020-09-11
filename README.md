## 🌍 Overview
A project to learn how to construct an **Express API** that uses **PostgresSQL**. 

I'm following the excellent [tutorial on Smashing Magazine](https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/) by Chidi Orji.

## 🐰 Quick reference

- `npm run build`: Build /src, output in /build.
- `npm run start`: Start server from /build. Services like Heroku will auto run this script on deploy.
- `npm run dev`: Start server in dev mode.
- `npm run lint`: Runs eslint
- `npm run lintfix`: Runs eslint with `--fix` flag
- `npm run pretty`: Runs prettier
- `npm run test`: Run tests with mocha and reporting with nyc

## 👷‍♀️ Architecture


### Database

Using a Postgres DB hosted by [ElephantSQL](https://www.elephantsql.com/). We connect to with with from Node using the [node-postgres](https://node-postgres.com/) lib. 

```sh
$ npm i --save pg
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

- `mocha`: Test runner. Looks for /test folder by default.
- `chai`: Assertion library
- `sinon-chai`: Extends Chai's assertion library
- `supertest`: Makes HTTP calls to our API endpoints


### Code style

Enforced with **eslint** and **prettier**. Configured in `.eslintrc.json`. (Note: a value of [0] in the config turns off a rule)

```bash
$ npm i --save-dev eslint eslint-config-airbnb-base eslint-plugin-import prettier
```

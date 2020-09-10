## 🌍 Overview

An project to learn how to construct an Express API with PostgresSQL. There will be no client-side code in this repo.

I'm following a [tutorial on Smashing Magazine](https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/) by Chidi Orji.

## 🐰 Quick reference

- `npm run prestart`: Build /src, output in /build
- `npm run start`: Start server from /build
- `npm run startdev`: Start server in dev mode

## 👷‍♀️ Architecture

### Node

Server code is written in ES6 syntax which Node doesn't currently support. We add the follow dev dependencies to help:
 
- `@babel/cli`: To run: ./node_modules/.bin/babel
- `@babel/core`
- `@babel/node: Works like node cli, but utilizes babel presets and plugins`
- `@babel/plugin-transform-runtime`: Helps avoid duplication in output.
- `@babel/preset-env`
- `@babel/register`: Compiles files on the fly and is required by tests.
- `@babel/runtime`


### Templating

Uses [EJS](https://ejs.co/).

```ejs
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>
```

### File structure

Project structure set up by _express generator_.
```
$ npm i express-generator
$ express

// Or even better
$ npx express-generator your-project-name --no-view
```

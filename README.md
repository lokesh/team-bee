# 🐝Team Bee

A word game based off of NYT's Spelling Bee. This repo includes the game UI. The backend API lives in [github.com/lokesh/team-bee-api](https://github.com/lokesh/team-bee-api).

## 🛠 To-do

**Next**
- [ ] Use socket.io to relay word additions between players
- [ ] Design distinct notifications for real-time.
- [ ] Add fav icon

**Design**
Isnpiration: Zach Gage games. Spelltower, Letterpress,
- Check games downloaded on phone and open tabs.
- Think about first, second, and third reads. What's necessary to visible in UI? Is hieararchy good?
- Add some life! color!
- [ ] Do a dance animation for all the tiles on a panagram. Make each one bounce up in sequence. Or try another animation. Outwards explosive bounce?
The initial design and interaction is heavily based off of the NYT game. Pre-release, make it distinct. Inspiration: https://wordhub.com/
- [ ] Is there an artifact people can take away or share from the game?

**UI**
- [ ] Add feedback when delete, shuffle, and enter are pressed with kbd

**Gameplay**
- [ ]Adjust points. One point per letter? Or more and more for longer? rather than 1 for four and then 5 points for 5?
- [ ] Once answers revealed, disable submitting new words for that puzzle for that user?

**User mgmt and security**
- [ ] Add simple token based security for puzzle crud
- [ ] Think about token for teams. Requiring a token to see user list on login.
- [ ] User sign up form
- [ ] API authentication

**Before sharing**
- [ ] Find a domain and final name
- [ ] Update design to prevent any confusion with the original NYT game.
- [ ] Give credit where credits are due for game design.


## 👨‍💻 Local development

### Quick reference

```
npm run serve // Compiles and hot-reloads for development
npm run build // Compiles and minifies for production
npm run lint
npm run deploy // FTPs files to lokeshdhakar.com/project/team-bee
```

### Set up

When the node env is set to `development`, the app will look for the API on localhost. You'll need to spin up the team-bee-api Node Express server for this.

The production API server hosted on Heroku has limited CORS domain origins to https://lokeshdhakar.com.

## 🚀 Deploy

This project is hosted on a shared static server alongside my other content for lokeshdhakar.com. The files are sent up via ftp. 🐌

## 👷‍♀️ Architecture

### Data init and bootstrapping

- **User**: We store the current user in localStorage and store it on app start up. If we don't find it, we have a router guard that will route them to Login screen.
- **Users**: Loaded on app creation.
- **Puzzles**: Loaded on app creation.


App.js - created...

- Load user list
- Load puzzle list

users: [id, name]
puzzles: [id, name, date]

- Set current puzzle as puzzle who has latest date that is not in future

puzzle: id, name, date, config, userProgress

### Data CRUD

#### Puzzles

Manually enter in DB.

#### Users

Manually enter in DB.


### For next time

- **PostgreSQL**: I spent way to much time fighting postgres. It was challenging to figure out things that should have been easy such as picking out the right data types and setting proper defaults (e.g. '{}'::character varying[] to set a default empty varchar array). The docs are bad.
- User mgmt
- API auth
- Polling for DB writes?

Try Firebase?

_Scratchpad_

It took a couple tries, but I'm happy with the db schema and the Vuex store organization.

1. Prefer initializing your store's initial state with all desired fields upfront.
2. When adding new properties to an Object, you should either:
* Use Vue.set(obj, 'newProp', 123), or
* Replace that Object with a fresh one. For example, using the object spread syntax
 we can write it like this:
state.obj = { ...state.obj, newProp: 123 }



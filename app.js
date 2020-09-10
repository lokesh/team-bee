const path = require('path');
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');

// --------------
// Init and configure app
// --------------

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --------------
// Use middleware
// --------------

// Custom logger

app.use(function(req, res, next) {
  console.log(req.method + ' ' + req.url + ' ' + (new Date()));
  next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true})); // For parsing application/x-www-form-urlencoded

// --------------
// Routing
// --------------

const router = require('./router');
const api = require('./api');

app.use('/api', api);
app.use('/', router);

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});


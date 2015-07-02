// Import built-in modules

var path = require('path');

// Import NPM modules

var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');

// Init app

var app = express();

// Configure app

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use middleware

// Custom logger
app.use(function(req, res, next) {
  console.log(req.method + ' ' + req.url + ' ' + (new Date()));
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true})); // For parsing application/x-www-form-urlencoded

// Setup routing

var todosRouter = require('./todos');
app.use(todosRouter);
// app.use('/api', require('api'));

app.listen(3000);

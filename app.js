// Import built-in modules
var path = require('path');

// Import NPM modules
var ejs = require('ejs');
var express = require('express');

// Init app
var app = express();

// Conigure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use middleware


// Define routes
app.get('/', function(req, res) {
  res.render('index', {
    'title': 'Hi there',
    'items': [
      {'desc': 'Item #1'} ,
      {'desc': 'Item #2'}
    ]
  });
});

app.get('/api/user/:id', function(req, res) {
  var userId = req.params.id;
  res.send(userId);
});

app.listen(3000);

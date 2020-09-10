const express = require('express');

// Data initialization

var todoItems = [
  { id: 1, desc: 'Indie'} ,
  { id: 2, desc: 'Bopper'},
  { id: 3, desc: 'Cottonball'}
];

// Routes

const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    'title': 'Hi there',
    'items': todoItems
  });
});

router.post('/add', function(req, res) {
  const newItem = req.body.newItem;
  todoItems.push({
    id: todoItems.length,
    desc: newItem
  });
  res.redirect('/');
});

module.exports = router;

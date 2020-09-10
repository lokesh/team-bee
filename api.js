const express = require('express');
const fs = require('fs');
const { resolve } = require('path');

const router = express.Router();

/*
Fetches new translations and saves them to file.
*/
router.get('/translations', function(req, res) {
	// return res.send(data);
   //  .catch(err => {
			// res.status(400).send(err);
   //  });
});

// Write data to file
router.post('/translations', function(req, res) {
  // const filepath = resolve(process.cwd(), 'public/data/translations-measured.json');
  // fs.writeFileSync(filepath, JSON.stringify(req.body, null, 2));

  // res.send('File saved: public/data/translations-measured.json');
});

module.exports = router;



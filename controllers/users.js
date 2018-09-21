const express = require('express');
const router = express.Router();
const db = require('../models'); 

router.put('/:id', (req, res) => {
	console.log('post route hit');
	db.User.findOneAndUpdate({ _id: req.params.id},
		{ portfolio: req.body.portfolio, workingCapital: req.body.workingCapital})
		.then(user => res.status(200))
		.catch(err => {
			console.log(err);
			res.status(500);
		});
});

module.exports = router; 
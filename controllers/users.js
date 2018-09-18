// ! Might not need this controller.  

const express = require('express');
const router = express.Router();
const db = require('../models'); 

router.get('/', (req, res) => {
	db.User.find()
	.then(users => {
		console.log('users controller did something')
		res.send(users);
	})
	.catch(err => {
		console.log(err);
		res.send(err);
	})
});

router.get('/createuser', (req, res) => {
	db.User.create({
		name: 'Star Wars Character',
		image: 'http://www.facetheforce.today/random/400',
		birthyear: Math.floor(Math.random() * 50) + 1950,
		admin: Math.random() < 0.5 ? true : false,
		color: 'blue'
	})
	.then(result => {
		console.log('users controller did something')
		res.send('success');
	})
	.catch(err => {
		console.log(err);
		res.send('error, check logs');
	})
});

module.exports = router; 
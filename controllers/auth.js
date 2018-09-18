require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const db = require('../models');
const router = express.Router();

// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  // ! Testing console log
  console.log(req.body);
  // Find out if the user exists (for login, they should)
  db.User.findOne({email: req.body.email})
  .then((user) => {
    if(!user || !user.password){
      // ! Testing console log
      console.log('user not found')
      return res.status(403).send('User not found');
    }

    // The user exists. Now, we want to validate their password
    if(!user.authenticated(req.body.password)){
      // User is invalid
      // ! Testing console log
      console.log('invalid credentials');
      return res.status(401).send('Invalid Credentials.');
    }

    // The user is valid!!! :)
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24
    });

    // Send that token and the user info
    // ! Testing console log
    console.log('successful login, token returned');
    res.send({ token: token });
  })
  .catch((err) => {
    console.log('error was', err);
    return res.status(503).send('Database Error. Sad day. :(');
  });
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', function(req, res) {
  // ! Testing console log
  console.log('body', req.body);
  // First check if the user already exists
  db.User.findOne({ email: req.body.email })
  .then((user) => {
    // Database call was a success
    if(user){
      // If the user exists already, don't let them create a duplicate account. Instead they should log in.
      return res.status(400).send('User exists already!');
    }
    // Great! This is a new user. Let's make them an account!
    db.User.create(req.body)
    .then((createdUser) => {
      // Make a token and send it as JSON, so the user can remain logged in
      const token = jwt.sign(createdUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 // 24 hours, in seconds
      });

      res.send({ token: token })
    })
    .catch((err) => {
      console.log('err', err);
      res.status(500).send('Could not create user in DB');
    });
  })
  .catch((err) => {
    console.log('err', err);
    res.status(500).send('Database Error! :(');
  });
});

// This is what is returned when client queries for new user data
router.post('/me/from/token', function(req, res) {
  console.log('token route hit')
  console.log(req.user)
  db.User.findById(req.user.id)
  .then(function(user){
    res.send({ user: user });
  })
  .catch(function(err){
    console.log(err);
    res.send({ user: null, error: 'server error' });
  });
});

module.exports = router;

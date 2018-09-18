// Require needed modules
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
const expressJWT = require('express-jwt');
const favicon = require('serve-favicon');
const path = require('path');

// Declare ap
const app = express();

// Middleware - serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // TODO: Find favicon asset.

// Middleware - Cross-origin resource sharing
app.use(cors());

// Middleware - Body Parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));

// 
function fromRequest(req){
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

// Include Controllers
app.use('/users', require('./controllers/users'));

// Define catch all route 
app.get('*', (req, res) => {
	// TODO: Build and render 404 page
	res.send({ message: 'error'});
});

// Listen on 3000
app.listen(3000, () => console.log('lisetening on three stacks'));
// Require needed modules
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
const expressJWT = require('express-jwt');
const favicon = require('serve-favicon');
const path = require('path');

// Declare app
const app = express();

// Middleware - serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // TODO: Find favicon asset.

// Middleware - Cross-origin resource sharing
app.use(cors());

// Middleware - Body Parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));

// Helper function for Auth
// TODO: Break fromRequest out into separate file.
function fromRequest(req){
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

// Include Controllers
app.use('/auth', expressJWT({
  // ! replace secret back to the env for production
  secret: process.env.JWT_SECRET,
  getToken: fromRequest,
}).unless({
  path: [
    { url: '/auth/login', methods: ['POST'] },
    { url: '/auth/signup', methods: ['POST'] }
  ]
}), require('./controllers/auth'));

// Define catch all route 
app.get('*', (req, res) => {
	// TODO: Build and render 404 page
	res.send({ message: 'error'});
});

// Listen
app.listen(process.env.PORT || 8000, () => console.log('listening on 8k'));
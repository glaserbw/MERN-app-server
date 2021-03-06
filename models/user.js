const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const portfolioSchema = new mongoose.Schema({
  symbol: String,
  numShares: Number,
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  email: { // TODO: Need to add email validation
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 99
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 99
  },
  profileImg: {
    type: String,
  },
  workingCapital: {
    type: Number,
  },
  portfolio: [portfolioSchema],
});

// Override 'toJSON' to prevent the password from being returned with the user
userSchema.set('toJSON', {
  transform: function(doc, user, options) {
    const returnJson = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      workingCapital: user.workingCapital,
      portfolio: user.portfolio,     
    };
    return returnJson;
  }
});

// Returns true if password hashes match, otherwise false.
userSchema.methods.authenticated = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// Mongoose's version of a beforeCreate hook
userSchema.pre('save', function(next) {
  const hash = bcrypt.hashSync(this.password, 10);
  // store the hash as the user's password
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);

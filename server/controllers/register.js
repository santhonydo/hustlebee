var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var sendgrid = require('sendgrid')('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');
var stripe = require("stripe")("sk_test_Wf8ZUqakNp9NOqETeWuE5AFU");
var registerFunction = require('./register_register.js');

module.exports = function(passport) {

  passport.use('register', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, registerFunction))

  // Generates hash using bCrypt
  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
}

var mongoose = require('mongoose');
var signupFunction = require('./emails_signup.js');

var Email = mongoose.model('Email');

module.exports = (function(){
  return {
    signup: signupFunction
  }
})()

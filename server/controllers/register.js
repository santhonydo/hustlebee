var LocalStrategy = require('passport-local').Strategy;
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

var login = require('./login');
var register = require('./register');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		console.log('serializing user: ' + user)
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			console.log('deserializing user: '+ user);
			done(err, user);
		});
	});

	login(passport);
	register(passport);
}
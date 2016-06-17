var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({ 
			passReqToCallback: true 
		},
		function(req, username, password, done){
			console.log('in login controllers')
			User.findOne({'username' : username}).populate('addresses').exec(
				function(err, user){
					if(err)
						return done(err);
					if(!user){
						console.log('User Not Found with username ' + username);
						return done(null, false, 
							req.flash('message', 'User Not found.'));
					}
          if(user.employer !== true){
            return done(null, false, req.flash('message', 'User Not Found'));
          }

					if(!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false,
							req.flash('message', 'Invalid Password'));
					}

					return done(null, user);
				}
			)
		}
	))
	
	passport.use('loginUser', new LocalStrategy({ 
			passReqToCallback: true 
		},
		function(req, username, password, done){
			console.log('in login controllers')
			User.findOne({'username' : username}).populate('addresses').exec(
				function(err, user){
					if(err)
						return done(err);
					if(!user){
						console.log('User Not Found with username ' + username);
						return done(null, false, 
							req.flash('message', 'User Not found.'));
					}
          if(user.employer !== false){
            return done(null, false, req.flash('message', 'User Not Found'));
          }

					if(!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false,
							req.flash('message', 'Invalid Password'));
					}

					return done(null, user);
				}
			)
		}
	))
	
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}




var LocalStrategy = require('passport-local').Strategy;
var stripe = require("stripe")("sk_live_DW1I6W9YtmtT2mPNRAWHiwBJ");
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({ 
			passReqToCallback: true 
		},
		function(req, username, password, done){
			User.findOne({'username' : username}).populate('addresses').exec(
				function(err, user){
					if(err)
						return done(err);
					if(!user){
						console.log('User Not Found with username ' + username);
						return done(null, false, 
							req.flash('message', 'User Not found.'));
					}
					if(!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false,
							req.flash('message', 'Invalid Password'));
					}
          if(user.card){
            stripe.customers.retrieve(user.card, function(err, customer){
              if( err ){
                user.card = false
              }
              else{
                user.card = true
              }
            })
            return done(null, user);
          }
          user.card = false;
					return done(null, user);
				}
			)
		}
	))
	
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}




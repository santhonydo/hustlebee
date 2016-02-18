var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var Shift = mongoose.model('Shift');
var User = mongoose.model('User');

module.exports = function(router){

	router.get('/jobPost', function(req, res){
		Shift.find({}, function(err, shifts){
			if(err){
				res.json({error: "Error retrieving shifts"});
			}else{
				res.json(shifts);
			}
		})
	});

	router.post('/registeration', function(req, res) {
		console.log(req.body);
		User.findOne({'email' : req.body.email}, function(err, user){
			if(err) {
				res.json({regError: "Error registering user"})
			}

			if(user){
				res.json({userExist: "User already exists!"})
			} else {
				var newUser = new User();

				newUser.firstName = req.body.firstName;
				newUser.lastName = req.body.lastName;
				newUser.email = req.body.email;
				newUser.password = createHash(req.body.password);
				newUser.employer = false;

				newUser.save(function(err, user) {
					if(err) {
						console.log("Error in saving user: " + err);
					} else {
						res.json(user);
					}
				})
			}
		})
	});

	router.post('/logIn', function(req, res){
		User.findOne({'email' : req.body.email}, function(err, user){
			if(err) {
				res.json({logInError: "Error logging in user"})
			}

			if (isValidPassword(user, req.body.password)) {
				res.json(user)
			} else {
				res.json({passwordError: "Invalid username or password"})
			}
		})
	});

}

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
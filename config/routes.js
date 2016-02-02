var emails = require('./../server/controllers/emails.js');

module.exports = function(app, passport){

	app.post('/signUp', function (req, res){
		emails.signup(req, res);
	});


	app.get('/logout', function(req, res){
		req.logout();
		res.status(200).json({status: 'Bye!'});
	});

	app.post('/login', function(req, res, next){
		passport.authenticate('login', function(err, user, info){
			if(err){
				console.log('error logging in: ' + err);
				return res.status(500).json({err: err});
			}
			if (user === false){
				console.log('false user');
				res.json(req.flash('message'))
			} else {
				res.status(200).send(user);
			}
		}) (req, res, next);
	});

	app.post('/register', function(req, res, next) {
		passport.authenticate('register', function(err, user) {
			if (err) {
				console.log('here is the error: ' + err);
				return next(err); 
			}
			if (user === false) {
				res.json(req.flash('message'));
			} else {
				console.log(user);
				res.status(200).send(user); 
			}
		})(req, res, next); 
	});

	// app.get('/user', function(req, res){
	// 		var item = {user: "Anthony", pass: "this is working"};
	// 		res.json(item);
	// 	});
}
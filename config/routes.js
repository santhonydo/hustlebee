var emails = require('./../server/controllers/emails.js');
var shifts = require('./../server/controllers/shifts.js');
var addresses = require('./../server/controllers/addresses.js');
var users = require('./../server/controllers/users.js');

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

	app.post('/postShift', function(req, res) {
		shifts.postShift(req, res);
	});

	app.post('/getShifts', function(req, res){
		shifts.getShifts(req, res);
	});

	app.post('/deleteShift', function(req, res){
		shifts.deleteShift(req, res);
	});

	app.post('/addAddress', function(req, res){
		addresses.add(req, res);
	});

	app.post('/deleteAddress', function(req, res){
		addresses.delete(req, res);
	});

	app.post('/getUser', function(req, res){
		users.getUser(req, res);
	});

	app.post('/updateUser', function(req, res){
		users.update(req, res);
	})



	// app.get('/user', function(req, res){
	// 		var item = {user: "Anthony", pass: "this is working"};
	// 		res.json(item);
	// 	});
}


















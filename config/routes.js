var emails = require('./../server/controllers/emails.js');
var shifts = require('./../server/controllers/shifts.js');
var addresses = require('./../server/controllers/addresses.js');
var users = require('./../server/controllers/users.js');
var sendgrid = require('sendgrid')('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');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var AWS = require('aws-sdk');

var async = require('async');
var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname+ '-' + Date.now()+'.jpg')
	}
});

module.exports = function(app, passport){

	app.post('/hustlebeeSignup', function (req, res){
		users.hustlebeeSignup(req, res);
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
      console.log(user);
			if (user === false){
				console.log('false user');
				res.json(req.flash('message'))
			} else {
				res.status(200).send(user);
			}
		}) (req, res, next);
	});

	app.post('/register', function(req, res, next){
    console.log('hi 3')
		passport.authenticate('register', function(err, user, info){
			if(err){
				console.log('error registering : ' + err);
				return res.status(500).json({err: err});
			}
			if (user === false){
        console.log(info, err)
				console.log('false user');
				res.json(req.flash('message'))
			} else {
				res.status(200).send(user);
			}
		}) (req, res, next);
	});

	app.post('/loginUser', function(req, res, next){
		passport.authenticate('loginUser', function(err, user, info){
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

	app.post('/forgot', function(req, res, next){
		async.waterfall([
			function(done){
				crypto.randomBytes(20, function(err, buf){
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function(token, done){
				User.findOne({ email: req.body.email }, function(err, user) {
					if (!user) {
						req.flash('error', 'No account with that email address exists.');
						return res.json({msg: 'No account with that email address exists.'});
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000;

					user.save(function(err) {
						done(err, token, user);
					});
				});
			},
			function(token, user, done){
				sendgrid.send({
					to : user.email,
					from: 'support@hustlebee.com',
					subject: 'Hustlebee Password Reset',
					html: '<p>Hi,</p><p>You are receiving this because you (or someone else) have requested a password reset for your Hustlebee account.</p><p>Please click on the following link, or paste this into your browser to complete the process: http://' + req.headers.host + '/#/business/reset/' + token + '</p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p><p>Best regards,</p><p>The Hustlebee Team</p>'
				}, function(err, json){
					req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
					res.json({msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.'})
					done(err, 'done');
				});
			}
		], function(err){
			if(err) return next(err);
		})
	});

	app.post('/reset', function(req, res){
		users.reset(req, res);
	});

	app.post('/newPassword', function(req, res){
		async.waterfall([
			function(done){
				User.findOne({resetPasswordToken: req.body.token, resetPasswordExpires: {$gt: Date.now()} }, function(err, user){
					if(!user){
						console.log('no user found to reset');
						return res.json({message: 'Error reseting'});
					}

					user.password = createHash(req.body.password);
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function(err){
						console.log('new passowrd saved');
						req.logIn(user, function(err){
							done(err, user);
						})
					});
				})
			},
			function(user, done) {
				sendgrid.send({
					to : user.email,
					from: 'support@hustlebee.com',
					subject: 'Your Hustlebee password has been changed',
					html: '<p>Hi,</p><p>This is a confirmation that the password for your Hustlebee account, ' + user.email + ' has just been changed.</p><p>If you did not perform this action, please contact us immediately at support@hustlebee.com.<p>Best regards,</p><p>The Hustlebee Team</p>'
				}, function(err, success){
					if(err) {
						console.log('Error sending email' + err)
					} else {
						console.log('success: ' + success)
						res.json(success);
					}
				});
			}
		])
	});

	app.post('/postShift', function(req, res) {
    console.log('bi')
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

	app.post('/EmployeeUpdateUser', function(req, res){
		users.employeeUpdate(req, res);
	})

	app.post('/adminUpdateUser', function(req, res){
		users.adminUpdate(req, res);
	})

	app.get('/getInfo', function(req, res){
		users.getInfo(req, res);
	})

	app.post('/addCard', function(req, res){
		users.addCard(req, res);
	})

	app.post('/getPictures', function(req, res){
		users.getPictures(req, res);
	})

	app.post('/adminLogin', function(req, res){
    console.log('hi', req.body)
		users.adminLogin(req, res);
    console.log('bi', res.body)
	})

	app.post('/adminDelete', function(req,res){
		users.adminDelete(req, res);
	})

	app.get('/checkPictureUpdates', function(req, res){
		users.checkPictureUpdates(req, res);
	})

	app.get('/getAllShifts', function(req, res){
		shifts.getAllShifts(req, res);
	})

	app.post('/getAvailableShifts', function(req, res){
		shifts.getAvailableShifts(req, res);
	})

	app.post('/updateShift', function(req, res){
		shifts.updateShift(req, res);
	})

	var upload = multer({ storage: storage });

  app.post('/multer', upload.single('file'), function(req, res, next){
    users.uploadPicture(req, res);
  });




	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}

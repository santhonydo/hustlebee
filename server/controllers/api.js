var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var sendgrid = require('sendgrid')('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');
var Shift = mongoose.model('Shift');
var User = mongoose.model('User');

module.exports = function(router){

	router.post('/assignShift', function(req, res) {
		var userID = req.body.userID;
		var shiftID = req.body.shiftID;
		var employeeFirstName = req.body.employeeFirstName;
		var employeeLastName = req.body.employeeLastName;
		var employeeEmail = req.body.employeeEmail;
		var employeePhoneNumber = req.body.employeePhoneNumber;

		User.findOne({_id: userID}, function(err, user){
			if(err) {
				res.json({error: "Error adding shift"})
			}

			if(user) {
				user.shifts.push(shiftID);
				user.save(function(err){
					if(err){
						res.json({error: "Error finding user to add shift"})
					} else {
						console.log('Shift linked to user successfully!');
					}
				})

				Shift.findByIdAndUpdate(shiftID, {$set: {accepted: 1, employee: userID}}, {new: true}).populate('employer').exec(function(err, shift) {
					if(err) {
						res.json({error: "Error"})
					} else {
						var employerEmail = shift.employer.email;
						var employerFirstName = shift.employer.firstName;
						var shiftDate = shift.date;

						sendgrid.send({
						to : employerEmail,
						bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'],
						from: 'support@hustlebee.com',
						subject: 'Shift Accepted',
						html: 'Hi ' + employerFirstName + 
								', </br></br>' + 
								'Your shift for ' + shiftDate + ', has been accepted. Below are some information regarding the employee.' + 
								'</br></br>' + 
								'<strong>Name: </strong>' +  employeeFirstName + ' ' + employeeLastName +
								'</br></br>' + 
								'<strong>Email: </strong>' + employeeEmail +
								'</br></br>' + 
								'<strong>Phone #: </strong>' + employeePhoneNumber +
								'</br></br>' +
								'If you have any questions or concerns regarding this employee, please contact us at support@hustlebee.com.' +
								'</br></br>' +
								'Best regards,' +
								'</br></br>' +
								'The HustleBee Team'
					}, function(err, json){
						if (err) {
							res.json({error: "Unknown error"})
						} else {
							res.json(shift)
						}
					});
					}
				})
			}
		})
	});

	router.post('/allShifts', function(req, res){
		var skipInt = req.body.skip;
		var limitInt = 10;
		var toGeoCode = req.body.toGeoCode;

		if (toGeoCode == true) {
			limitInt = 0;
		}

		Shift.find({'accepted': 0}).skip(skipInt).limit(limitInt).populate('employer').exec(function(err, shifts){
			if(err){
				res.json({error: "Error retrieving shifts"});
			}else{
				var resultCount = shifts.length;
				res.json({resultCount: resultCount, results: shifts});
			}
		})
	});

	router.post('/getUserShifts', function(req, res){
		var employeeID = req.body.userID;
		Shift.find({"employee" : employeeID}).populate('employer').exec(function(err, shifts){
			if(err){
				res.json({error: "Error finding user shifts"});
			} else {
				var resultCount = shifts.length;
				res.json({resultCount: resultCount, results: shifts});
			}
		})
	});

	router.post('/updateShiftStatus', function(req, res){
		var shiftID = req.body.shiftID;
		var shiftStatus = req.body.shiftStatus;
		var clockedInTimeStr = req.body.shiftClockedInTime;
		var clockedOutTimeStr = req.body.shiftClockedOutTime;

		if (shiftStatus == undefined) {
			Shift.update({'_id': shiftID}, {$set: {clockedInTime: clockedInTimeStr}}, function(err){
				if(err){
					console.log('error updating clocked in time');
				} else {
					res.json({success: "clocked in"})
				}
			})
		} else {
			Shift.update({'_id': shiftID}, {$set: {clockedOutTime: clockedOutTimeStr, accepted: shiftStatus}}, function(err){
				if(err){
					console.log('error updating clocked out time');
				} else {
					res.json({success: "clocked out"})
				}
			})
		}
	});

	router.post('/registeration', function(req, res) {
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
				newUser.stateOfLicensure = req.body.stateOfLicensure;
				newUser.licenseNumber = req.body.licenseNumber;
				newUser.licenseExpirationDate = req.body.licenseExpirationDate;
				newUser.zipcode = req.body.zipcode;
				newUser.occupation = req.body.occupation;
				newUser.email = req.body.email;
				newUser.phoneNumber = req.body.phoneNumber;
				newUser.password = createHash(req.body.password);
				newUser.status = 0;
				newUser.employer = false;

				newUser.save(function(err, user) {
					if(err) {
						console.log("Error in saving user: " + err);
					} else {
						sendgrid.send({
                            to : req.body.email,
                            bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'], 
                            from: 'anthony@hustlebee.com',
                            subject: 'Welcome to HustleBee!',
                            html: 'Hi ' + req.body.firstName + 
                                ', </br></br>' + 
                                'My name is Dr. Anthony Do, PharmD, one of HustleBee co-founders. I would like to personally welcome you to HustleBee. </br></br> Our customer representative will contact you shortly to orient you on our platform and collect some information to verify your license. If you have any additional questions or comments, you can contact us at support@hustlebee.com or email me directly at anthony@hustlebee.com. </br></br>My team and I are thrilled to have you as apart of our healthcare team. </br></br>' +
                                'Best regards,' +
                                '</br></br>' +
                                'Anthony & The HustleBee Team'
                        }, function(err, json){
                            if (err){
                                return console.log(err);
                            }
                            console.log(json);
                        }); 
						res.json(user);
					}
				})
			}
		})
	});

	router.post('/logIn', function(req, res){
		User.findOne({'email' : req.body.email}, function(err, user){
			if(err) {
				res.json({logInError: "Error logging in user"});
				return
			}

			if(!user){
				res.json({noUserFound: "No user"});
				return
			}

			if (isValidPassword(user, req.body.password)) {
				res.json(user)
			} else {
				res.json({passwordError: "Invalid username or password"})
			}
		})
	});

	router.post('/resetPassword', function(req, res){
		var email = req.body.email
		var randomText = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for (var i=0; i < 6; i++) {
        	randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    	}

    	User.findOne({'email': email}, function(err, user){
    		if (err) {
    			return res.json({error: "Unknown error"})
    		}

    		if (!user){
    			return res.json({error: "No user found"})
    		}

    		user.resetPasswordToken = randomText;
    		user.resetPasswordExpires = Date.now() + 3600000;

    		user.save(function(err){
	   			if(err) {
					res.json({error: "Unknown error"})
	    		} else {
	    			sendgrid.send({
						to : email,
						from: 'support@hustlebee.com',
						subject: 'HustleBee Password Reset',
						text: 'We got a new shift!',
						html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account. </br> </br>Here is your reset token: <strong>' + randomText + '</strong></br></br>If you did not request this, please ignore this email and your password will remain unchanged.\n'
					}, function(err, json){
						if (err) {
							res.json({error: "Unknown error"})
						} else {
							res.json({resetEmailSent: "success"})
						}
					});
	   			}
   			})
    	})
	})

	router.post('/tokenResetPassword', function(req, res){
		var token = req.body.resetToken
		var password = req.body.password
		User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
			if (err) {
				console.log(err);
				return
			}
			if(!user){
				return res.json({tokenExpired: 'Error resetting'});
			}

			var hashPass = createHash(password);
			console.log(hashPass);
			user.password = hashPass;

			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			user.save(function(err){
				if(err) {
					res.json({error: "Unknown error"})
	    		} else {
	    			res.json({success: "Password updated"})
	    		}
			});
		})
	})

	router.post('/updateUserProfile', function(req, res) {
		var userID = req.body.userID;
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var currentEmail = req.body.currentEmail;
		var phoneNumber = req.body.phoneNumber;
		var licenseExpirationDate = req.body.licenseExpirationDate;

		if (email != currentEmail) {
			User.findOne({"email": email}, function(err, user){
				if(user) {
					console.log("user exists")
					res.json({userExist: "Email taken"})
				} else {
					User.findByIdAndUpdate(userID, {$set: {firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber, licenseExpirationDate: licenseExpirationDate}}, {new: true},function(err, result) {
						if(err) {
							res.json({error: "Error"})
						} else {
							res.json(result);
						}
					})
				}
			})
		} else {
			User.findByIdAndUpdate(userID, {$set: {firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber, licenseExpirationDate: licenseExpirationDate}}, {new: true},function(err, result) {
				if(err) {
					res.json({error: "Error"})
				} else {
					res.json(result);
				}
			})
		}
	});	
}

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
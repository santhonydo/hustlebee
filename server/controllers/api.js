var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var Shift = mongoose.model('Shift');
var User = mongoose.model('User');

module.exports = function(router){

	router.post('/assignShift', function(req, res) {
		var userID = req.body.userID;
		var shiftID = req.body.shiftID;

		User.findOne({_id: userID}, function(err, user){
			if(err) {
				res.json({error: "Error adding shift"})
			}

			if(user) {
				user.shifts.push(shiftID);
				user.save(function(err){
					if(err){
						console.log('Error adding shift to user');
						res.json({error: "Error finding user to add shift"})
					} else {
						console.log('Shift linked to user successfully!');
					}
				})

				Shift.update({'_id' : shiftID}, {"$set": {"accepted" : 1, "employee": userID}}, function(err){
					if(err){
						console.log("Error finding shift");
						res.json({error: "Error updating shift status"})
					} else {
						console.log("shift status updated")
						res.json({success: "success"})
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
					console.log('successfully updated clocked in time');
				}
			})
		} else {
			Shift.update({'_id': shiftID}, {$set: {clockedOutTime: clockedOutTimeStr, completed: shiftStatus}}, function(err){
				if(err){
					console.log('error updating clocked out time');
				} else {
					console.log('successfully updated clocked out time');
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
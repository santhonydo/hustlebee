var mongoose = require('mongoose');
var sendgrid = require('sendgrid')('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');

var Shift = mongoose.model('Shift');

module.exports = function () {
	return {
		postShift: function(req, res){
			var shiftData = req.body.shift;
			var userData = req.body.userInfo;
			var shift = new Shift(shiftData);
			shift.save(function(err, data){
				if (err){
					console.log('error saving shift to database');
				} else {
					console.log('successfully added a shift');
					sendgrid.send({
						to : 'santhonydo@gmail.com',
						from: 'shifts@hustlebee.com',
						subject: 'New Shift!',
						text: 'We got a new shift!',
						html: '<h1>New Shift Added!</h1><p>Shift Date: ' + shiftData.date + '</p><p>Start Time (24H): ' + shiftData.startTime + '</p><p>Shift Duration: ' + shiftData.duration + '</p><p>Shift Position: ' + shiftData.position + '</p><p>Shift Address: ' + shiftData.shiftAddress + '</p><p>Shift Employer Name: ' + userData.firstName + ' ' + userData.lastName + ' </p><p>Company: ' + userData.companyName + ' </p><p>Phone Number: ' + ' ' + userData.phoneNumber + ' </p><p>Email: ' + userData.email + '</p>'
					}, function(err, json){
						if (err){
							return console.log(err);
						}
						console.log(json);
					});

					res.json(data);
				}
			})
		},

		getShifts: function(req, res){
			var employerId = req.body['_id'];

			Shift.find({employer: employerId}, function(err, shifts){
				if(err){
					console.log(err);
				}else{
					res.json(shifts);
				}
			})

		},

		deleteShift: function(req, res){
			var shiftId = req.body.id;

			Shift.remove({_id: shiftId}, function(err, removed){
				if (err) {
					console.log('error removing shift from db');
				} else {
					var success = {removed: "removed"};
					res.json(success);
				}
			})
		}
	}	
}()
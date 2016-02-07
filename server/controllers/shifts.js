var mongoose = require('mongoose');

var Shift = mongoose.model('Shift');

module.exports = function () {
	return {
		postShift: function(req, res){

			var shift = new Shift(req.body);

			shift.save(function(err, data){
				if (err){
					console.log('error saving shift to database');
				} else {
					console.log('successfully added a shift');
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
					console.log('found shifts: ' + shifts);
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
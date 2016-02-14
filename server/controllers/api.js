var mongoose = require('mongoose');
var Shift = mongoose.model('Shift');

module.exports = function(router){
	router.get('/jobPost', function(req, res){
		Shift.find({}, function(err, shifts){
			if(err){
				res.json({error: "Error retrieving shifts"});
			}else{
				res.json(shifts);
			}
		})
	})
}
var mongoose = require('mongoose');

var User = mongoose.model('User');

module.exports = (function(){
	return {
		getUser: function(req, res){
			User.findOne({_id: req.body.id}).populate('addresses').exec(function(err, user){
				if(err){
					console.log('Error finding user');
				} else {
					res.json(user);
				}
			})
		},

		update: function(req, res){
			var userInfo = req.body;
			User.update({_id: userInfo._id}, {$set: {companyName: userInfo.companyName, firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, phoneNumber: userInfo.phoneNumber}}, function(err){
				if(err){
					console.log('Error updating user info');
				} else {
					console.log('Successfuly updated user info');
					var success = {msg: 'Saved successfully!'};
					res.json(success)
				}
			})
		}
	}
})()
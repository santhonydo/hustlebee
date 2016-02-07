var mongoose = require('mongoose');

var Address = mongoose.model('Address');
var User = mongoose.model('User');

module.exports = function(){
	return {
		add: function(req, res){
			var address = new Address(req.body);

			User.findOne({_id: req.body.userId}, function(err, user){
				user.addresses.push(address._id);
				user.save(function(err){
					if(err){
						console.log('Error adding address to user');
					} else {
						console.log('Address linked to user successfully!');
					}
				})

				address.save(function(err){
					if(err){
						console.log('Error saving address');
					} else {
						console.log('Address added to db successfully');
						var success = {msg: 'Address added'};
						res.json(success);
					}
				})
			})
		},

		delete: function(req, res){
			Address.remove({_id: req.body.addressId}, function(err, data){
				if(err){
					console.log('Error removing adddress');
				} else {
					var success = {msg: 'Address deleted'};
					res.json(success);
				}
			})
		}
	}
}()
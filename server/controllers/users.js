var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var sendgrid = require('sendgrid')('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');

module.exports = (function(){
	return {

		adminDelete: function(req,res){
			User.remove({_id: req.body._id}, function(err,user){
				console.log('user deleted')
				res.json(true)
			});
		},

		adminLogin: function(req, res){
			if(req.body.password == "dojo2015swag"){
				res.json(true);
			}
			else{
				res.json(false);
			}
		},

		getInfo: function(req, res){
			User.find({}).populate('addresses').exec(function(err, results){
				if(err){
					console.log(err);
				}
				else{
					res.json(results);
				}
			})
		},

		getPictures: function(req, res){
			var AWS = require('aws-sdk');
			AWS.config.loadFromPath('./config/config.json');
			var s3 = new AWS.S3();
			var params = {Bucket: 'hustlebee', Key: "photoID/" + req.body._id};
			s3.getSignedUrl('getObject', params, function (err, url) {
        res.json(url)
			});
		},

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
		},

		adminUpdate: function(req, res){
			var userInfo = req.body;
			User.update({_id: userInfo._id}, {$set: {firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, phoneNumber: userInfo.phoneNumber, zipcode: userInfo.zipcode, licenseNumber: userInfo.licenseNumber, licenseExpirationDate: userInfo.licenseExpirationDate, stateOfLicensure: userInfo.stateOfLicensure, status: userInfo.status, username: userInfo.username}}, function(err){
				if(err){
					console.log('Error updating user info');
				} else {
					console.log('Successfuly updated user info');
					var success = {msg: 'Saved successfully!'};
					res.json(success)
				}
			})
		},

		reset: function(req, res){
			User.findOne({resetPasswordToken: req.body.id}, function(err, user){
				if(err){
					console.log(err);
				} else {
					res.json(user);
				}
			})
		},

		hustlebeeSignup: function(req, res){
			User.findOne({'email' : req.body.email}, function(err, user){

				if(err) {
					res.json({regError: "Error registering user"})
				}

				if(user){
					res.json({userExist: "User already exists!"})
				} else {
					var newUser = new User();
					var userInfo = req.body

					newUser.firstName = userInfo.firstName;
					newUser.lastName = userInfo.lastName;
					newUser.email = userInfo.email;
					newUser.phoneNumber = userInfo.phone;
					newUser.occupation = userInfo.occupation;
					newUser.stateOfLicensure = userInfo.stateLicense;
					newUser.licenseNumber = userInfo.licenseNumber;
					newUser.licenseExpirationDate = userInfo.licenseExpirationDate;
					newUser.password = createHash("hustlebee2016");
					newUser.status = 0;
					newUser.employer = false;

					newUser.save(function(err, user) {
						if(err) {
							console.log("Error in saving user: " + err);
						} else {
							sendgrid.send({
								to : userInfo.email,
								bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'], 
								from: 'anthony@hustlebee.com',
								subject: 'Welcome to Hustlebee!',
								html: '<p>Hi ' + userInfo.firstName + ' ' + userInfo.lastName + ', </p><p>My name is Dr. Anthony Do, PharmD, one of Hustlebee co-founders. I would like to personally welcome you to Hustlebee.</p><p>Our customer representative will contact you shortly to orient you on our platform and collect some information to verify your license. If you have any additional questions or comments, you can contact us at support@hustlebee.com or email me directly at anthony@hustlebee.com.</p><p>My team and I are thrilled to have you as part of our healthcare team. </p><p>Best regards,</p><p>Anthony & The Hustlebee Team</p>'
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
		}
	}
})()

var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

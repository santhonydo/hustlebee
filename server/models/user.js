var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	companyName: String,
	email: String,
	username: String,
	password: String,
	phoneNumber: String,
	stateOfLicensure: String,
	occupation: String,
	licenseNumber: String,
	licenseExpirationDate: String,
	zipcode: Number,
	status: Number,
	card: String,
	addresses: [{type: Schema.Types.ObjectId, ref: 'Address'}],
	employer: false,
	shifts: [{type: Schema.Types.ObjectId, ref: 'Shift'}],
	resetPasswordToken: String,
  	resetPasswordExpires: Date,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);

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
	addresses: [{type: Schema.Types.ObjectId, ref: 'Address'}],
	employer: false,
	_Shifts: [{type: Schema.Types.ObjectId, ref: 'Shift'}],
	resetPasswordToken: String,
  	resetPasswordExpires: Date,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);
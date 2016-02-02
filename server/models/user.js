var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	companyName: String,
	email: String,
	username: String,
	password: String,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);
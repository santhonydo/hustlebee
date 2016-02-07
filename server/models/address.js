var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AddressSchema = new mongoose.Schema({
	street: String,
	suite: String,
	city: String,
	state: String,
	zipcode: Number,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('Address', AddressSchema);
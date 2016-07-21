var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CreditSchema = new mongoose.Schema({
	street: String,
	suite: String,
	city: String,
	state: String,
	zipcode: Number,
	coordinate: Object,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('Credit', CreditSchema);

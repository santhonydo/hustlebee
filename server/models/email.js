var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmailSchema = new mongoose.Schema({
	name: String,
	profession: String,
	email: String,
	created_at: {type: Date, default: Date.now}
});

mongoose.model('Email', EmailSchema);
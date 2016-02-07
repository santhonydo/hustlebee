var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShiftSchema = new mongoose.Schema({
	date: String,
	duration: Number,
	position: String,
	accepted: false,
	shiftAddress: String,
	employer: {type: Schema.Types.ObjectId, ref: 'User'},
	employee: {type: Schema.Types.ObjectId, ref: 'User'},
	created_at: {type: Date, default: Date.now}
})

mongoose.model('Shift', ShiftSchema);
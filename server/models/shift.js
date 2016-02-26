var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShiftSchema = new mongoose.Schema({
	date: String,
	startTime: Number,
	duration: Number,
	position: String,
	accepted: Number,
	shiftAddress: Object,
	employer: {type: Schema.Types.ObjectId, ref: 'User'},
	employee: {type: Schema.Types.ObjectId, ref: 'User'},
	created_at: {type: Date, default: Date.now}
})

mongoose.model('Shift', ShiftSchema);
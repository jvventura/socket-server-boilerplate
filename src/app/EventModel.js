import mongoose from 'mongoose';

let schema = mongoose.Schema({
	eventID: String,
	type: String,
	timestamp: Number
});

let Event = mongoose.model('Event', schema);

export default Event;
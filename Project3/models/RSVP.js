const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    connection: {type: Schema.Types.ObjectId, ref: 'User'},
    user: {type: Schema.Types.ObjectId, ref: 'Connections'},
    state: {type: String, required: [true, 'An RSVP response is required!']},
});

module.exports = mongoose.model('RSVP', rsvpSchema);


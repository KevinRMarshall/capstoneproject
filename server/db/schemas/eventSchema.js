const db = require('../connection');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    //displayName: {type: String, required: true},
    eventName: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    date: {type: Date, required: true},
    comments: {type: String, default: ''},
    participants: {type: Array, default: []},
    
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
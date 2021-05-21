const db = require('../connection');
const mongoose = require('mongoose');

const schoolEventsSchema = new mongoose.Schema({
    program: {type: String, required: true, default: 'CPA'},
    starttime: {type: String, required: true},
    endtime: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true },
    date: {type: Date, required: true},
});

const SchoolEvents = mongoose.model('SchoolEvents', schoolEventsSchema);



module.exports = SchoolEvents;
const reportSchema = require('./reportSchema');
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    programId: {type: String, required: true},
    displayName: {type: String, default: ''},
    discussion: {type: String, required: true},
    dateCreated: {type: Number, required: true},
    eventDate: {type: String, default: ''},
    reports: [reportSchema],
    userId: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
const db = require('../connection');
const mongoose = require('mongoose');
const reportSchema = require('./reportSchema');

const replySchema = new mongoose.Schema({
    threadId: {type: String, required: true},
    displayName: {type: String, default: ''},
    reports: [reportSchema],
    dateCreated: {type: Number, required: true},
    userId: {type: String, required: true},
    content: {type: String, required: true},
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
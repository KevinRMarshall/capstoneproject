const db = require('../connection');
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    senderDisplay: {type: String},
    content: {type: String, required: true},
    link: {type: String, default: ''},
    read: {type: Boolean, default: false},
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
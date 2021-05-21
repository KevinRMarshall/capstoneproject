const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    content: {type: String},
});

module.exports = reportSchema;
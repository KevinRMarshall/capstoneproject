const db = require('../connection');
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {type: String, required: true}
});

const feedSchema  = new mongoose.Schema({
    dateCreated: {type: Date, required: true},
    userId: {type: String, required: true},
    displayName: {type: String},
    content: {type: String, required: true},
    likes: [likeSchema],
    link: {type: String, default: ''},
    programId: {type: String, required: true},
});

const Feed = mongoose.model('feed', feedSchema);

module.exports = Feed;
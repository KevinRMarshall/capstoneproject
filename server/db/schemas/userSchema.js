const db = require('../connection');
const mongoose = require('mongoose');
const { json } = require('express');

const userSchema = new mongoose.Schema({
    id: String,
    token: String,
    firstName: String,
    lastName: String,
    email: String,
    canPost: {type: Boolean, default: true},
    isAdmin: {type: Boolean, default: false},
    programId: Number
});

const User = mongoose.model('User', userSchema);

var getUser = function(userId, callback) {
    User.findOne({'id': userId}, function (err, data) {
        callback(err, data);
    });
}

module.exports = {
    User,
    getUser
};
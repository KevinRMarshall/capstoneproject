const db = require('../connection');
const mongoose = require('mongoose');

const endorsementSchema = new mongoose.Schema({
    userId: {type: String, required: true},
});

const profileSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    displayName: {type: String, required: true},
    strongestCourse: {type: String, default: ''},
    weakestCourse: {type: String, default: ''},
    studyStrengths: {type: String, default: ''},
    studyWeakness: {type: String, default: ''},
    available: {type: String, default: ''},
    timezone: {type: String, default: ''},
    meritPoints: {type: Number, default: 0},
    endorsements: [endorsementSchema],
    contact: {type: String, default: ''},
    program: {type: String, required: true, default: 'CPA'},
});

const Profile = mongoose.model('Profile', profileSchema);

var getProfile = function(userId, callback) {
    Profile.findOne({'userId': userId}, function (err, data) {
        callback(err, data);
    });
}

module.exports = {
    Profile,
    getProfile
};
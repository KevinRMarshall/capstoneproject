//const cloud_db = 'mongodb+srv://admin:3SdTwWzqgxxEI6mb@ascit-study-supports.epu0v.mongodb.net/test?authSource=admin&replicaSet=atlas-lvbz07-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const { json } = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:3SdTwWzqgxxEI6mb@ascit-study-supports.epu0v.mongodb.net/acsitStudySupport?authSource=admin&replicaSet=atlas-lvbz07-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //were connected!
});

module.exports = db;
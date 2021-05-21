const router = require('express-promise-router')();
//profile model
const Profile = require('../db/schemas/profileSchema');

var app = require('../app');
const { User } = require('../db/schemas/userSchema');

router.post('/', async (req, res) => {
    console.log("profile post req body: " + JSON.stringify(req.body));
    var user = await User.findOne({id: req.body.userId});
    var display  = (user.firstName != null && user.firstName != '') ? (user.firstName + ' ' + user.lastName) : (user.email);
    var add = new Profile.Profile({
        userId: req.body.userId,
        displayName: display,
        strongestCourse: req.body.strongestCourse,
        weakestCourse: req.body.weakestCourse,
        studyStrengths: req.body.studyStrengths,
        studyWeakness: req.body.studyWeakness,
        available: req.body.available,
        timezone: req.body.timezone,
        meritPoints: req.body.meritPoints,
        contact: req.body.contact,
        program: req.body.program,
    });

    add.save((err) => {
        if(err) return console.log(err);
        res.json(add);
      });
});

router.patch('/', async (req, res) => {
    console.log("profile patch req body: " + JSON.stringify(req.body));
    var profile = await Profile.Profile.findOneAndUpdate({userId: req.body.userId},
        {
            strongestCourse: req.body.strongestCourse,
            weakestCourse: req.body.weakestCourse,
            studyStrengths: req.body.studyStrengths,
            studyWeakness: req.body.studyWeakness,
            available: req.body.available,
            contact: req.body.contact,
        }, async function(err, profile) {
            if(err) console.log(err);
            else {
                res.json(profile);
            }
        });

    
});

//get a single profile from db
router.get('/', async (req, res) => {
    var user = await User.findOne({id: req.query.userId});
    var prof = await Profile.Profile.findOne({userId: req.query.userId});
    if(prof) {
        console.log(JSON.stringify(prof));
        res.json({
            prof,
            email: user.email,
        });
    }
    else {
        res.json({'error': 'not-found'});
    }
});

//endorse a profile
let endorseValue = 10;
router.patch('/endorse', async (req, res) => {
    console.log('in endorse api');
    var userId = req.query.userId;
    var profile = await Profile.Profile.findOne({userId: userId});

    isDuplicate = false;
    profile.endorsements.forEach(e => {
        if(e.userId === req.body.userId) {
            isDuplicate = true;
        }
    });

    if(!isDuplicate) {
        profile.endorsements.push(req.body);
        profile.meritPoints += endorseValue;
        var updated = await profile.save();
        if(updated) {
            res.status(201).json({updated});
        } else {
            res.status(400).json({'error': 'could not apply endorsement.'});
        }
    } else {
        res.status(400).json({'duplicate': 'already endorsed.'});
    }
});

module.exports = router;
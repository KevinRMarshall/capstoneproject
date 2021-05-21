const router = require('express-promise-router')();
//model
const Feed = require('../db/schemas/feedSchema');
const { User } = require('../db/schemas/userSchema');

//get
router.get('/', async (req, res) => {
    var feed = await Feed.find({programId: req.query.programId}).limit(10).sort({dateCreated: -1});
    res.status(200).json(feed);  
});

//post feed item
router.post('/', async (req, res) => {
    var add = new Feed(req.body);
    var user = await User.findOne({id: req.body.userId});
    var display = (user.firstName != null && user.firstName != '') ? (user.firstName + ' ' + user.lastName) : (user.email);
    add.displayName = display;
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.status(200).json(add);
    });
});

//patch likes
router.patch('/', async (req, res) => {
    console.log("feed patch req body: " + JSON.stringify(req.body));
    var feed = await Feed.findOne({_id: req.body._id});  
    if (feed) {
        duplicateReport = false;

        feed.likes.forEach(f => {
            if(f.userId === req.body.userId) {
                duplicateReport = true;
            }
        });

        if(duplicateReport) {
            return res.status(200).json({'duplicate': 'User has already liked.'});
        }
        feed.likes.push({userId: req.body.userId});
        const updated = await feed.save();
        res.status(200).json(updated);
    } else {
        res.status(400).json({'error': 'could not add like'});
    }
});

module.exports = router;
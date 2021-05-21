const router = require('express-promise-router')();
//model
const Alert = require('../db/schemas/alertSchema');
const User = require('../db/schemas/userSchema');
//get
router.get('/', async (req, res) => {
    allRead = true;
    user = req.query.userId;
    var alerts = (await Alert.find({userId: user})).reverse();
    alerts.forEach(e => {
        if(!e.read) allRead = false;
    });
    res.status(200).json({
        alerts,
        allRead,
    });  
});

//post
router.post('/', async (req, res) => {
    console.log(req.body);
    var add = new Alert(req.body);
    var sender = await User.User.findOne({id: req.body.senderId});
    var display = (sender.firstName != null && sender.firstName != '') ? (sender.firstName + ' ' + sender.lastName) : (sender.email);
    add.senderDisplayName = display;
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.status(200).json(add);
    });
});

//patch
router.patch('/read', async (req, res) => {
    let user = req.query.userId;
    var update = await Alert.updateMany({userId: user, read: false}, {read: true});
    if(update) {
        res.status(200).json({'OK': 'updated alerts'});
    } else {
        res.status(400).json({'error': 'could not update alerts'});
    }
});

module.exports = router;
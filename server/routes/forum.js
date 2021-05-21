const router = require('express-promise-router')();
//model
const Thread = require('../db/schemas/threadSchema');
const User = require('../db/schemas/userSchema');
const Reply = require('../db/schemas/replySchema');

//thread per page, replys per page
const tPerPage = 5;
const rPerPage = 10;

//get all threads
router.get('/', async (req, res) => {
    var threads;
    let skip = tPerPage * (Number(req.query.page) - 1);
    let count;
    if(req.query.search != null && req.query.search != '') {
        pattern = new RegExp(`${req.query.search}`);
        console.log(pattern);
        threads = await Thread.find({programId: [req.query.program, 'all'], discussion: req.query.discussion, title: {$regex: pattern, $options: 'i'}}).skip(skip).limit(tPerPage);
        count = await Thread.countDocuments({programId: [req.query.program, 'all'], discussion: req.query.discussion, title: {$regex: pattern, $options: 'i'}});
    } else {
        threads = await Thread.find({programId: [req.query.program, 'all'], discussion: req.query.discussion}).skip(skip).limit(tPerPage).sort({dateCreated: -1});
        count = await Thread.countDocuments({programId: [req.query.program, 'all'], discussion: req.query.discussion});
    }
    if(threads) {
        console.log(count);
        res.json({
            threads: threads,
            count: count,
            perPage: tPerPage,
        });
    }
    else {
        res.json({'error': 'not-found'});
    }
});
//post a thread
router.post('/', async (req, res) => {
    console.log("thread POST req body: " + JSON.stringify(req.body));

    //CHECK if this is being posted in student services, if so make program all
    var program = 'all';
    var userId = 1;
    if(req.body.discussion != 'services') {
        program = req.body.programId;
        userId = req.body.userId;
    }

    var add = new Thread({
        programId: program,
        discussion: req.body.discussion,
        displayName: await getUserDisplayName(userId),
        dateCreated: Date.now(),
        eventDate: req.body.eventDate,
        userId: userId,
        title: req.body.title,
        content: req.body.content,
    })
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.json(add);
    });
});
//update a thread
router.patch('/', async (req, res) => {
    console.log("thread patch req body: " + JSON.stringify(req.body));

    Thread.updateOne({_id: req.body.threadId},
        {title: req.body.title,
         content: req.body.content}, 
         async function(err, thread) {
             if(err) {
                console.log(err);
             } else {
                var thread = await Thread.findOne({_id: req.body.threadId});
                console.log(thread);
                res.json(thread);
             }
         });
});
//delete thread + replies to it
router.delete('/', async(req, res) => {
    console.log(req.query);
    var thread = await Thread.deleteOne({_id: req.query.threadId});
    var replys = await Reply.deleteMany({threadId: req.query.threadId});
    console.log(thread);
    console.log(replys);
    res.status(201).json({});
});

//reply stuff
//get thread + replys
router.get('/thread', async (req, res) => {
    console.log("thread + reply req body: " + JSON.stringify(req.query));
    console.log('getting thread + replys...');
    var ret = {};
    let skip = rPerPage * (Number(req.query.page) - 1);
    var thread = await Thread.findOne({_id: req.query.threadId});
    var replys = await Reply.find({threadId: req.query.threadId}).skip(skip).limit(rPerPage);
    var count = await Reply.countDocuments({threadId: req.query.threadId});

    ret.thread = thread;
    ret.replys = replys;
    ret.replyCount = count;
    ret.perPage = rPerPage;

    res.json(ret);
});
//post reply to thread
router.post('/thread', async (req, res) => {
    console.log("reply POST req body: " + JSON.stringify(req.body));

    var add = new Reply({
        threadId: req.body.threadId,
        displayName: await getUserDisplayName(req.body.userId),
        dateCreated: Date.now(),
        userId: req.body.userId,
        content: req.body.content,
    })
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.json(add);
    });
})

//update reply to thread
router.patch('/thread', async(req, res) => {
    console.log("reply patch req body: " + JSON.stringify(req.body));

    Reply.updateOne(
        {_id: req.body.replyId},
        {content: req.body.content}, 
         async function(err, reply) {
             if(err) {
                console.log(err);
             } else {
                var reply = await Reply.findOne({_id:req.body.replyId});
                console.log(reply);
                res.json(reply);
             }
         });
});
//delete reply
router.delete('/thread', async(req, res) => {
    var reply = await Reply.deleteOne({_id: req.query.replyId});
    console.log(reply);
    res.status(201).json({status: '200'});
})

//utilities
//find a user and return a display name
async function getUserDisplayName(_id) {
    let display = '';
    var user = await User.User.findOne({id: _id});
    if(user.firstName != null && user.firstName != "") {
        display = `${user.firstName} ${user.lastName}`;
    } else {
        display = user.email;
    }
    return display;
}

//get a formatted today date and return
async function getFormattedToday() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let today = new Date();
    return `${addZero((months[today.getMonth()]))} ${addZero(today.getDate())}, ${today.getFullYear()}
     ${addZero(today.getHours())}:${addZero(today.getMinutes())}:${addZero(today.getSeconds())}`;
}

//add 0 to times with 1 digit
function addZero(n) {
    if(n <= 9) {
        return "0" + n;
    }
    return n;
}

module.exports = router;
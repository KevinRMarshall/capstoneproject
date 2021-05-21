const router = require('express-promise-router')();
//school events model
const SchoolEvents = require('../db/schemas/schoolEventsSchema');

//post a school event
router.post('/', async (req, res) => {
    console.log("School Events POST req body: " + JSON.stringify(req.body));

    var add = new SchoolEvents({
        program: req.body.program,
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
    })
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.json(add);
    });
});

//update a post
router.patch('/', async (req, res) => {
    console.log("School events patch req body: " + JSON.stringify(req.body));

    SchoolEvents.updateOne({_id: req.body._id},
        {   title: req.body.title,
            content: req.body.content,
            date: req.body.date,
            starttime: req.body.starttime,
            endtime: req.body.endtime,}, 
         async function(err, thread) {
             if(err) {
                console.log(err);
             } else {
                var schoolevents = await SchoolEvents.findOne({_id: req.body._id});
                console.log(schoolevents);
                res.json(schoolevents);
             }
         });
});
//delete thread + replies to it
router.delete('/', async(req, res) => {
    var schoolEvents = await SchoolEvents.findOneAndDelete({_id: req.query.eventId});
    console.log(schoolEvents);
    res.json({status: 'ok'});
});


//get all threads
router.post('/schoolevents', async (req, res) => {
    var schoolevents;
    schoolevents = await SchoolEvents.find({program: req.body.program});
    if(schoolevents) {
        res.json(schoolevents);
    }
    else {
        res.json({'error': 'not-found'});
    }
});
//get a single profile from db
router.post('/findevent', async (req, res) => {
    var events = await SchoolEvents.findOne({_id: req.body.id});
    if(events) {
        res.json(events);
    }
    else {
        res.json({'error': 'not-found'});
    }
});

module.exports = router;
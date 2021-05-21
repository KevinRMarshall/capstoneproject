const router = require('express-promise-router')();
const e = require('express');
//model
const Event = require('../db/schemas/eventSchema');

//post
router.post('/', async (req, res) => {

    console.log("event post req body: " + JSON.stringify(req.body));
    var add = new Event({        
        userId: req.body.userId,
        //displayName: 'hi',
        eventName: req.body.eventName,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime:  req.body.endTime,
        comments: req.body.comments,
        participants: req.body.participants,
    })
    add.save((err) => {
        if(err) {
            return console.log(err);
        }
        res.json(add);
    });
});

//patch
router.patch('/', async (req, res) => {

    console.log("event patch req body: " + JSON.stringify(req.body));
    var event = await Event.findOneAndUpdate(
        {_id: req.body._id}, 
        { 
            eventName: req.body.eventName,
            startTime: req.body.startTime,
            endTime:  req.body.endTime,
            comments: req.body.comments,
            date: req.body.date,
            participants: req.body.participants, 
        });
        if (event == null){
            res.status(500);
        }
        res.json(event);
    });  

//delete
router.delete('/', async(req, res) => {    
    var event = await Event.deleteOne(
        {_id: req.query.eventId}
    );    
    console.log(event);    
    res.status(201).json({success:'succcess!'})
});

//get
router.post('/events', async (req,res) => {
    console.log(req.body);
    var events = await Event.find({userId: req.body.userId});
    console.log(events);
    res.json(events);   
});

//get
router.get('/frontevents', async (req,res) => {
    console.log(req.query);
    var stripped = req.query.userId.replace(/\s+/g, '')
    console.log("hello");
    var events = await Event.find({userId: stripped, date:{$gte: req.query.startdate , $lte: req.query.enddate}});
    console.log(events);
    console.log("Events");
    res.json(events);   
});

module.exports = router;
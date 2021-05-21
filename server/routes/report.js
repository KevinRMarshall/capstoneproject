const router = require('express-promise-router')();

//models
const Thread = require('../db/schemas/threadSchema');
const Reply = require('../db/schemas/replySchema');

router.patch('/thread', async (req, res) => {
    console.log(JSON.stringify(req.body));

    var report = {
        userId: req.body.userId,
        content: req.body.content,
    };

    var thread = await Thread.findOne({_id: req.body.threadId});

    //check if there is a report for this user already
    console.log(thread.reports);
    duplicateReport = false;
    thread.reports.forEach(report => {
        if(report.userId === req.body.userId) {
            duplicateReport = true;
        }
    });

    if(duplicateReport) {
        return res.json({'duplicate': 'User has already submitted report for reply.'});
    }
    thread.reports.push(report);
    const updated = await thread.save();
    res.json(updated);
});

router.patch('/reply', async (req, res) => {
    console.log(JSON.stringify(req.body));

    var report = {
        userId: req.body.userId,
        content: req.body.content,
    };

    var reply = await Reply.findOne({_id: req.body.replyId});

    //check if there is a report for this user already
    console.log(reply.reports);
    duplicateReport = false;
    reply.reports.forEach(report => {
        if(report.userId === req.body.userId) {
            duplicateReport = true;
        }
    });

    if(duplicateReport) {
        return res.json({'duplicate': 'User has already submitted report for thread.'});
    }
    reply.reports.push(report);
    const updated = await reply.save();
    res.status(201).json(updated);
});

router.get('/', async (req, res) => {
    const threads = await Thread.find({'reports.0': {$exists: true}});
    const replies = await Reply.find({'reports.0': {$exists: true}});
    //console.log(JSON.stringify(threads) + '\n' + JSON.stringify(replies));

    res.status(201).json({
        threads: threads,
        replies: replies,
    });
});

router.patch('/approve', async (req, res) => {
    const type = req.query.threadId ? 'thread' : 'reply'
    console.log(type);
    if(type === 'thread') {
        const thread = await Thread.findOne({_id: req.query.threadId});
        thread.reports = [];
        await thread.save();
        res.status(201).json({'success': 'Reports removed'});
    } else {
        const reply = await Reply.findOne({_id: req.query.replyId});
        reply.reports = [];
        await reply.save();
        res.status(201).json({'success': 'Reports removed'});
    }
});

module.exports = router;
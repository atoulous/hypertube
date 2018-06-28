import _ from 'lodash';
import moment from 'moment-timezone';


const router = require('express').Router();
const fs = require('fs');
const Comments = require('../models/Comments');

router.get('/comment/:id', async (req, res) => {

    Comments.find({'id_film': req.params.id}, (err, comments) => {
        if (comments)
          res.json({nocomment: false, comments})
        else
          res.json({nocomment: true})
    })
});

router.post('/comment/:id', async (req, res) => {

    const newComment = new Comments();
    newComment.comment = req.body.comment;
    newComment.user.id = req.user._id;
    newComment.user.picture = req.user.picture;
    newComment.user.name = req.user.name;
    newComment.id_film = req.params.id;
    newComment.save((err) => {
        if (err) throw err;
    });
    res.json({change: true})
});

module.exports = router;

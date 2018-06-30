import UserModel from '../models/users';
import Comments from '../models/Comments';
const Secu = require('../models/secu.js');
const readchunk = require('read-chunk');
const isPng = require('is-png');
const isJpg = require('is-jpg');
const _ = require('lodash');
const fs = require('fs');


const router = require('express').Router();

router.get('/comment/:id', async (req, res) => {
  	const comments = await Comments.find({ id_film: req.params.id }).sort([['date', -1]])
    return res.json(comments);
});

router.get('/otherprofile/:id', async (req, res) => {
  try {
    UserModel.findOne({ name: req.params.id }, (err, user) => {
        if (user) { res.status(200).json({ name: user.name, lastname: user.lastname, firstname: user.firstname, picture: user.picture  }); } else { res.status(400).json({ merror: 'no user' }); }
    });
  } catch (err) {
      console.error('/otherprofile/:id err', err);
  }
});


router.post('/comment/:id', async (req, res) => {
    try {
        if (req.body.comment === undefined || req.body.comment === '')
            res.json({change: false});
        else {
            const newComment = new Comments();
            newComment.comment = req.body.comment;
            newComment.user.id = req.user._id;
            newComment.user.picture = req.user.picture;
            newComment.user.name = req.user.name;
            newComment.id_film = req.params.id;
            newComment.save((err) => {
                if (err) throw err;
            });
            res.json({change: true, newComment});
        }
        }
    catch (err) {
            console.error('/comment/:id err', err);
        }
});

router.get('/starred/:idMedia', async (req, res) => {
  try {
    const { _id } = req.user;
    const { idMedia } = req.params;
    const user = await UserModel.findOne({ _id });
    if (user.mediasStarred.indexOf(idMedia) === -1) {
      user.mediasStarred.push(idMedia);
    }
    user.save();

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error('/starred/:idMedia err', err);
  }
});

router.get('/unstarred/:idMedia', async (req, res) => {
  try {
    const { _id } = req.user;
    const { idMedia } = req.params;
    const user = await UserModel.findOne({ _id });
    const index = user.mediasStarred.indexOf(idMedia);
    if (index !== -1) {
      user.mediasStarred.splice(index, 1);
    }
    user.save();

    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error('/starred/:idMedia err', err);
  }
});


router.get('/profile', (req, res, next) => {
        return res.json({ merror: 'success', login: true, user: req.user });
});


router.post('/profile', (req, res, next) => {
        let merror = '';
        if (!Secu.verif(req.body.firstname) || !Secu.verif(req.body.lastname) || !Secu.verif(req.body.email) || !Secu.verif(req.body.language)) {
            if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                    if (err) throw err;
                });
            }
            res.json({ merror: 'Empty form field.', change: false });
        }
        else if (!Secu.isValid(req.body.firstname) || !Secu.isValid(req.body.lastname)) {
            if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                    if (err) throw err;
                });
            }
            res.json({ merror: 'Incorrect charactere or to many characteres', change: false });
        }else if (!Secu.isEmail(req.body.email)) {
            if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                    if (err) throw err;
                });
            }
            res.json({ merror: 'Incorrect Email.', change: false });
        } else {
            UserModel.findOne({ name: req.user.name }, (err, user) => {
                if (err) throw err;
                if (user) {
                    UserModel.findOne({ email: req.body.email, name: { $ne: req.user.name } }, (err, auser) => {
                        if (err) throw err;
                        if (auser) {
                            if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                                fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                                    if (err) throw err;
                                });
                            }
                            res.json({ merror: 'Email already used.', change: false });
                        } else {
                            user.email = req.body.email;
                            user.firstname = req.body.firstname;
                            user.lastname = req.body.lastname;
                            user.language = req.body.language;
                            if (Secu.verif(req.body.password)) {
                                if (user.auth !== 'local') {
                                    merror = 'Only local account can change password.';
                                } else if (Secu.isGoodPassword(req.body.password)) {
                                    user.password = user.generateHash(req.body.password);
                                } else {
                                    merror = 'A strong password consists of a combination of upper and lowercase letters and numbers.';
                                }
                            }
                            if (req.file) {
                                if (fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                                    const type = readchunk.sync(`${__dirname}/../uploads/${req.file.filename}`, 0, 8);
                                    if (!isPng(type) && !isJpg(type)) {
                                        fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                                            if (err) throw err;
                                        });
                                        merror = 'Incorrect picture file.';
                                    } else {
                                        const ext = isJpg(type) ? 'jpg' : 'png';
                                        user.picture = `http://localhost:5000/uploads/${req.user.name}.${ext}`;
                                        fs.rename(`${__dirname}/../uploads/${req.file.filename}`, `${__dirname}/../uploads/${req.user.name}.${ext}`, (err) => {
                                            if (err) throw err;
                                        });
                                    }
                                }
                            }
                            user.save((err) => {
                                if (err) throw err;
                                res.json({
                                    merror,
                                    change: true,
                                    user: {
                                        auth: user.auth,
                                        login: user.login,
                                        picture: user.picture,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        language: user.language,
                                    },
                                });
                            });
                        }
                    });
                } else { res.json({ message: 'Incorrect user', change: false }); }
            });
        }
});


module.exports = router;

import UserModel from '../models/users';
import Comments from '../models/Comments';

const router = require('express').Router();

router.get('/comment/:id', async (req, res) => {
  Comments.find({ id_film: req.params.id }, (err, comments) => {
    if (comments) { res.json({ nocomment: false, comments }); } else { res.json({ nocomment: true }); }
  });
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
      const newComment = new Comments();
      newComment.comment = req.body.comment;
      newComment.user.id = req.user._id;
      newComment.user.picture = req.user.picture;
      newComment.user.name = req.user.name;
      newComment.id_film = req.params.id;
      newComment.save((err) => {
        if (err) throw err;
      });
      res.json({ change: true, newComment });
    } catch (err) {
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

module.exports = router;

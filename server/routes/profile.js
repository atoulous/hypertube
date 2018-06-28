import UserModel from '../models/users';
import Comments from '../models/Comments';

const router = require('express').Router();

router.get('/comment/:id', async (req, res) => {
  Comments.find({ id_film: req.params.id }, (err, comments) => {
    if (comments) { res.json({ nocomment: false, comments }); } else { res.json({ nocomment: true }); }
  });
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
  res.json({ change: true });
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

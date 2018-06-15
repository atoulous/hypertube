const router = require('express').Router();
const fs = require('fs');

const Media = require('../models/Media');
const MediaController = require('../controllers/MediaController');

router.get('/all/:skip', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;

  Media.find({}).limit(10).skip(skip)
    .then(medias => res.status(200).json(medias))
    .catch((err) => { console.log('err==', err); });
});

router.get('/movies/:skip', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;

  Media.find({}).where('mediaType').equals('movie').limit(10).skip(skip)
    .then(medias => res.status(200).json(medias))
    .catch((err) => { console.log('err==', err); });
});

router.get('/shows/:skip', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;

  Media.find({}).where('mediaType').equals('show').limit(10).skip(skip)
    .then(medias => res.status(200).json(medias))
    .catch((err) => { console.log('/shows err==', err); });
});

router.get('/startmedia/:id', async (req, res) => {
  Media.findOne({ _id: req.params.id })
    .then(async (media) => {
      if (!media) return res.status(404).end('that does not exist');

      // Media is not dowloaded or downloading, start it.
      if (media.status === 'listed') {
        await MediaController.downloadTorrent(media);
      }

      // temporary :)
      setTimeout(() => res.status(200).json({}).end(), 1000);
    })
    .catch(err => res.status(404).end('that does not exist', err));
});

const serveWhenAvailable = async (res, filePath) => {
  if (fs.existsSync(filePath)) {
    return res.status(200).end(fs.readFileSync(filePath));
  }
  console.log(filePath, 'does not exist.');
  setTimeout(() => serveWhenAvailable(res, filePath), 1000);
  return null;
};

router.get('/:mid/*.m3u8', (req, res) => {
  res.set('Content-type', 'application/x-mpegURL');
  const filePath = `${__dirname}/../controllers/streams/${req.params.mid}/ps.m3u8`;
  serveWhenAvailable(res, filePath);
});

router.get('/:mid/*.ts', (req, res) => {
	const target = req.originalUrl.replace('/api/media', '')
  const filePath = `${__dirname}/../controllers/streams${target}`;
  res.set('Content-type', 'application/octet-stream');
  serveWhenAvailable(res, filePath);
})

module.exports = router;

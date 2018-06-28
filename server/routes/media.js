import _ from 'lodash';
import fs from 'fs';

import Crawler from '../crawler/crawler';
import UserModel from '../models/users';

const router = require('express').Router();
const Media = require('../models/Media');
const MediaController = require('../controllers/MediaController');
const MetadatasHelper = require('../crawler/MetadatasHelper');

router.get('/local/:type/:skip/:term/:sortedBy/:startDate/:endDate', async (req, res) => {
  try {
    const { _id } = req.user;
    const skip = parseInt(req.params.skip, 10);
    const { term, type, sortedBy, startDate, endDate } = req.params;
    const termRegex = new RegExp(term, 'i');
    const termSearch = term !== 'null' ? { displayName: termRegex } : {};

    let dateSearch = {};
    if (startDate !== 'null' && endDate !== 'null') {
      dateSearch = {
        'metadatas.productionDate': {
          $gte: new Date(startDate.toString(), 1, 1),
          $lt: new Date(endDate.toString(), 12, 30),
        },
      };
    }

    const allSearch = { ...dateSearch, ...termSearch };

    let medias = [];
    switch (type) {
      case 'all':
        medias = await Media.find(allSearch)
          .sort({ 'metadatas.score': -1 })
          .limit(10)
          .skip(skip);
        break;
      case 'movies':
        medias = await Media.find(allSearch)
          .sort({ 'metadatas.score': -1 })
          .where('mediaType')
          .equals('movie')
          .limit(10)
          .skip(skip);
        break;
      case 'shows':
        medias = await Media.find(allSearch)
          .sort({ 'metadatas.score': -1 })
          .where('mediaType')
          .equals('show')
          .limit(10)
          .skip(skip);
        break;
    }

    medias = _.uniqBy(medias, 'displayName');
    if (sortedBy) medias = _.sortBy(medias, sortedBy);


    // const user = await UserModel.find({ _id }, 'mediasStarred');
    // const { mediasStarred } = user[0];
    // medias.forEach((media, index) => {
    //   mediasStarred.forEach((mediaStarred) => {
    //     if (media._id.toString() === mediaStarred.toString()) {
    //       medias[index] = { ...medias[index], starred: true };
    //       console.log('media==', medias[index]);
    //     }
    //   });
    // });

    res.status(200).json(medias);
  } catch (err) {
    console.error('media/all err', err);
  }
});

router.get('/crawler/:type/:term/:sortedBy', async (req, res) => {
  try {
    const { type, term, sortedBy } = req.params;

    let medias = [];
    switch (type) {
      case 'all':
        medias = await Crawler.searchAll(term, 5);
        break;
      case 'movies':
        medias = await Crawler.searchMovie(term, 3);
        break;
      case 'shows':
        medias = await Crawler.searchShow(term, 10);
        break;
    }

    medias = _.uniqBy(medias, 'displayName');
    if (sortedBy) medias = _.sortBy(medias, sortedBy);

    res.status(200).json(medias);
  } catch (err) {
    console.error('media/crawler err', err);
  }
});

router.get('/media/:id', async (req, res) => {
  const media = await Media.findOne({ _id: req.params.id });
  await MetadatasHelper.fetchMetadatas(media, true, media.mediaType === 'movie' ? 'movie' : 'tv');

  return res.status(200).json(media);
});

router.get('/startmedia/:id', async (req, res) => {
  Media.findOne({ _id: req.params.id })
    .then(async (media) => {
      if (!media) res.status(404).json({ error: 'This media does not exist' });

      media.lastSeen = new Date().toISOString();
      await media.save();

      UserModel.findOne({ _id: req.user._id })
        .then((user) => {
          user.mediasSeen = [...user.mediasSeen, req.params.id];
          user.mediasSeen = _.uniqBy(user.mediasSeen, e => e);
          user.save();
        })
        .catch((err) => { throw err; });

      // Media is not dowloaded or downloading, start it.
      if (media.status === 'listed') {
        MediaController.downloadTorrent(media)
          .then(() => res.status(200).json(media).end())
          .catch(() => res.status(422).json({ error: 'This media could not be played, either it does not have enough seeders, or it was corrupted.' }));
      } else {
        return res.status(200).json(media).end();
      }
    }).catch((err) => {
      console.error('[/startmedia/:id] err ', err);
      res.status(404).json({ error: 'This media could not be played.' });
    });
});

router.get('/saw/:type/:sortedBy', async (req, res) => {
  const { _id } = req.user;
  const { type, sortedBy } = req.params;

  const user = await UserModel.findOne({ _id }, 'mediasSeen');

  let medias = [];
  if (user.mediasSeen.length) {
    await Promise.all(user.mediasSeen.map(async (id) => {
      const media = await Media.findOne({ _id: id });
      if (media.mediaType === type || type === 'all') {
        medias.push(media);
      }
    }));
  }
  if (sortedBy) medias = _.sortBy(medias, sortedBy);

  return res.status(200).json(medias).end();
});

router.get('/starred/:type/:sortedBy', async (req, res) => {
  const { _id } = req.user;
  const { type, sortedBy } = req.params;

  const user = await UserModel.findOne({ _id }, 'mediasStarred');

  let medias = [];
  if (user.mediasStarred.length) {
    await Promise.all(user.mediasStarred.map(async (id) => {
      const media = await Media.findOne({ _id: id });
      if (media.mediaType === type || type === 'all') {
        medias.push(media);
      }
    }));
  }
  if (sortedBy) medias = _.sortBy(medias, sortedBy);

  return res.status(200).json(medias).end();
});

const serveWhenAvailable = async (res, filePath) => {
  if (fs.existsSync(filePath)) {
    return res.status(200).end(fs.readFileSync(filePath));
  }
  console.log(filePath, 'does not exist.');
  setTimeout(() => serveWhenAvailable(res, filePath), 1000);
  return null;
};

const serveStaticFile = (req, res, mime) => {
  const target = req.originalUrl.replace('/api/media', '');
  const filePath = `${__dirname}/../controllers/streams${target}`;
  res.set('Content-type', mime);
  serveWhenAvailable(res, filePath);
};

router.get('/:mid/*.m3u8', (req, res) => {
  serveStaticFile(req, res, 'application/x-mpegURL');
});

router.get('/:mid/*.ts', (req, res) => {
  serveStaticFile(req, res, 'application/octet-stream');
});

router.get('/:mid/*.vtt', (req, res) => {
  serveStaticFile(req, res, 'text/vtt');
});

module.exports = router;

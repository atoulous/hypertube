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
  console.log('id111===', req.params);
  Media.findOne({ _id: req.params.id })
    .then(async (media) => {
      if (!media) res.status(404).json({ error: `This media does not exist.:${err}` });

      media.lastSeen = new Date().toISOString();
      await media.save();

      console.log('id===', req.user._id);
      UserModel.findOne({ _id: req.user._id })
        .then((user) => {
          user.mediasSeen = [...user.mediasSeen, req.params.id];
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

router.get('/saw', async (req, res) => {
  const { _id } = req.user;

  const user = await UserModel.findOne({ _id }, 'mediasSeen');
  console.log('user==', user);

  let medias = [];
  if (user.mediasSeen.length) {
    medias = await Promise.all(user.mediasSeen.map(async id => Media.findOne({ _id: id })));
  }

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

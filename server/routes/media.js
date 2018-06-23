const router = require('express').Router();
const fs = require('fs');
const Media = require('../models/Media');
const MediaController = require('../controllers/MediaController');

const MetadatasHelper = require('../crawler/MetadatasHelper')
import _ from 'lodash';
import Crawler from '../crawler/crawler';

router.get('/local/:type/:skip/:term', async (req, res) => {
  try {
    const skip = parseInt(req.params.skip, 10);
    const { term, type } = req.params;
    const termRegex = new RegExp(term, 'i');
    const search = term !== 'null' ? { displayName: termRegex } : {};

    let medias = [];
    switch (type) {
      case 'all':
        medias = await Media.find(search).limit(10).skip(skip);
        break;
      case 'movies':
        medias = await Media.find(search).where('mediaType').equals('movie').limit(10).skip(skip);
        break;
      case 'shows':
        medias = await Media.find(search).where('mediaType').equals('show').limit(10).skip(skip);
        break;
    }

    medias = _.uniqBy(medias, 'displayName');

    res.status(200).json(medias);
  } catch (err) {
    console.error('media/all err', err);
  }
});

router.get('/crawler/:type/:term', async (req, res) => {
  try {
    const { type, term } = req.params;

    let medias = [];
    switch (type) {
      case 'all':
        medias = await Crawler.searchAll(term, 5);
        break;
      case 'movies':
        medias = await Crawler.searchMovie(term, 5);
        break;
      case 'shows':
        medias = await Crawler.searchShow(term, 5);
        break;
    }

    medias = _.uniqBy(medias, 'displayName');

    res.status(200).json(medias);
  } catch (err) {
    console.error('media/crawler err', err);
  }
});


router.get('/startmedia/:id', async (req, res) => {
	Media.findOne({ _id: req.params.id })
	.then(async (media) => {
  		if (!media) res.status(404).json({ error: 'This media does not exist.:' + err })
		await MetadatasHelper.fetchMetadatas(media, true, media.mediaType === 'movie' ? 'movie' : 'tv')

		// Media is not dowloaded or downloading, start it.
		if (media.status === 'listed') {
			MediaController.downloadTorrent(media).then(() => {
				return res.status(200).json(media).end()
			}).catch(() => {
				return res.status(422).json({ error: 'This media could not be played, either it does not have enough seeders, or it was corrupted.' })
			})
		} else {
			return res.status(200).json(media).end()
		}
	}).catch(err => res.status(404).json({ error: 'This media could not be played.' }));
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
	const target = req.originalUrl.replace('/api/media', '')
    const filePath = `${__dirname}/../controllers/streams${target}`;
    res.set('Content-type', mime);
    serveWhenAvailable(res, filePath);
}

router.get('/:mid/*.m3u8', (req, res) => {
	serveStaticFile(req, res, 'application/x-mpegURL')
});

router.get('/:mid/*.ts', (req, res) => {
	serveStaticFile(req, res, 'application/octet-stream')
})

router.get('/:mid/*.vtt', (req, res) => {
	serveStaticFile(req, res, 'text/vtt')
})

module.exports = router;

const router = require('express').Router();
const fs = require('fs');
const Media = require('../models/Media');
const MediaController = require('../controllers/MediaController');

const Crawler = require('../crawler/crawler')
const MetadatasHelper = require('../crawler/MetadatasHelper')

router.get('/all/:skip/:term', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;
  const term = req.params ? req.params.term : null;
  const search = term !== 'null' ? { displayName: term } : {};

	Media.find(search).limit(10).skip(skip)
		.then(medias => res.status(200).json(medias))
		.catch((err) => { console.log('err==', err); });
});

router.get('/movies/:skip/:term', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;
  const term = req.params ? req.params.term : null;
  const search = term !== 'null' ? { displayName: term } : {};

  Media.find(search).where('mediaType').equals('movie').limit(10).skip(skip)
    .then(medias => res.status(200).json(medias))
    .catch((err) => { console.log('err==', err); });
});

router.get('/shows/:skip/:term', (req, res) => {
  const skip = req.params ? parseInt(req.params.skip, 10) : 0;
  const term = req.params ? req.params.term : null;
  const search = term !== 'null' ? { displayName: term } : {};

  Media.find(search).where('mediaType').equals('show').limit(10).skip(skip)
    .then(medias => res.status(200).json(medias))
    .catch((err) => { console.log('/shows err==', err); });
});

router.get('/startmedia/:id', async (req, res) => {
	Media.findOne({ _id: req.params.id })
	.then(async (media) => {
  		if (!media) res.status(404).json({ error: 'This media does not exist.:' + err })
		if (media.needFetchMetadata) {
			console.log('media needs metadatas')
			await MetadatasHelper.fetchMetadatas(media, true, media.mediaType === 'movie' ? 'movie' : 'tv')
			await media.save()
			console.log('media metadatas fetched :)')
		}

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

router.get('/search/:term', async (req, res) => {
	const results = await Crawler.search(req.params.term)
	const localResults = await Media.find({displayName: new RegExp(req.params.term, 'i') }).limit(5)
	return res.status(200).json({
		local: localResults,
		distant: results
	})
})

router.get('/searchLocal/all/:term', async (req, res) => {
  const localResults = await Media.find({ displayName: new RegExp(req.params.term, 'i') }, 'displayName');

  return res.status(200).json(localResults);
});


router.get('/searchLocal/movies/:term', async (req, res) => {
  const localResults = await Media.find({ displayName: new RegExp(req.params.term, 'i') }, 'displayName').where('mediaType').equals('movie');

  return res.status(200).json(localResults);
});

router.get('/searchLocal/shows/:term', async (req, res) => {
  const localResults = await Media.find({ displayName: new RegExp(req.params.term, 'i') }, 'displayName').where('mediaType').equals('show');

  return res.status(200).json(localResults);
});

module.exports = router;

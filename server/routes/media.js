'use strict'

const router = require('express').Router()
const Media = require('../models/Media')
const MediaController = require('../controllers/MediaController')
const fs = require('fs')

router.get('/media', (req, res) => {
	Media.find({}).then(medias => {
		return res.status(200).json(medias)
	})
})

router.get('/startmedia/:id', async (req, res) => {
	Media.findOne({ _id: req.params.id }).then(async media => {
		if (!media) return res.status(404).end('that does not exist')

		// Media is not dowloaded or downloading, start it.
		if (media.status === 'listed') {
			await MediaController.downloadTorrent(media)
		}

		// temporary :)
		setTimeout(() => {
			return res.status(200).end()
		}, 1000)
	}).catch(err => {
		return res.status(404).end('that does not exist')
	})
})


const serveWhenAvailable = async (res, filePath) => {
	if (fs.existsSync(filePath)) {
		return res.status(200).end(fs.readFileSync(filePath))
	} else {
		setTimeout(() => {
			return serveWhenAvailable(res, filePath)
		}, 1000)
	}
}
router.get('/:mid/*.m3u8', (req, res) => {
	res.set('Content-type', 'application/x-mpegURL')
	const filePath = __dirname + '/../controllers/streams' + req.originalUrl
	serveWhenAvailable(res, filePath)
})
router.get('/:mid/stream_vtt.m3u8', (req, res) => {
	res.set('Content-type', 'application/x-mpegURL')
	const filePath = __dirname + '/../controllers/streams' + req.originalUrl
	serveWhenAvailable(res, filePath)
})

router.get('/:mid/*.vtt', (req, res) => {
	const filePath = __dirname + '/../controllers/streams' + req.originalUrl
	res.set('Content-type', 'application/octet-stream')
	serveWhenAvailable(res, filePath)
})
router.get('/:mid/*.ts', (req, res) => {
	const filePath = __dirname + '/../controllers/streams' + req.originalUrl
	res.set('Content-type', 'application/octet-stream')
	serveWhenAvailable(res, filePath)
})




router.get('/play/:id', (req, res) => {
	res.sendFile(__dirname + '/player.html')
})

module.exports = router

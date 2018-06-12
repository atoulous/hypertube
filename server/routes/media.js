'use strict'

const router = require('express').Router()
const Media = require('../models/Media')
const MediaController = require('../controllers/MediaController')

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

router.get('/play/:id', (req, res) => {
	res.sendFile(__dirname + '/player.html')
})

module.exports = router

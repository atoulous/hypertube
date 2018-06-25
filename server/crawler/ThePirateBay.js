'use strict'

const request = require('request'),
	htmlparser = require("htmlparser2"),
	Media = require('../models/Media'),
	Utils = require('./utils'),
	MetadatasHelper = require('./MetadatasHelper')

let mirrorArr = [
	'https://pirateproxy.mx',
	'https://thepbproxy.com',
	'https://pirateproxy.sh',
	'https://thepiratebay-org.prox.space',
	'https://cruzing.xyz',
	'https://proxydl.cf'
]

const getNewMirror = async() => {
	return new Promise(async(resolve, reject) => {
		const mirror = await Promise.race(mirrorArr.map(mirror => testMirror(mirror)))
		return resolve(mirror)
	})
}

const testMirror = async(mirror) => {
	return new Promise((resolve, reject) => {
		request(mirror + '/search/avengers/0/99/201', { method: 'GET' }, async (err, res, body) => {
			if (!err && res && (res.statusCode >= 200 && res.statusCode <= 299) && body.indexOf("We're experiencing some issues with the database. Please try again soon.") === -1) {
				return resolve(mirror)
			}
		})
	})
}

const downloadHtml = async (host, url) => {
	return new Promise(async (resolve, reject) => {
		request(host + url, async (err, res, body) => {
			if (err) return reject(err)
			if (res.statusCode < 200 || res.statusCode > 299) {
				// The mirror crapped its pants. Pick a new one and restart operation
				mirrorArr = mirrorArr.filter(el => el !== host)
				const newMirror = await getNewMirror()
				const html = await downloadHtml(newMirror, url)
				return resolve(html)
			}
			return resolve(body)
		})
	})
}

const parseHtml = async (html) => {
	return new Promise((resolve, reject) => {
		const torrentsArray = []
		let currentTorrent = {}
		let grab = null

		var parser = new htmlparser.Parser({
			onopentag: (name, attribs) => {
				if (name === 'a' && attribs.class && attribs.class === 'detLink') {
					grab = 'name'
				} else if (name === 'a' && attribs.href && attribs.href.startsWith('magnet:?')) {
					currentTorrent.magnet = attribs.href
				} else if (name === 'td' && attribs.align && attribs.align === 'right' && !currentTorrent.seeders) {
					grab = 'seeders'
				} else if (name === 'td' && attribs.align && attribs.align === 'right'  && !currentTorrent.leechers) {
					grab = 'leechers'
				}
			}, ontext: (text) => {
				if (!grab) return
				currentTorrent[grab] = text
				if (grab === 'leechers') {
					torrentsArray.push(currentTorrent)
					currentTorrent = {}
				}
				grab = null
			}, onerror: (err) => {
				return reject(err)
			} }, {
				decodeEntities: true
		})
		parser.write(html)
		parser.end()
		return resolve(torrentsArray)
	})
}

const finishTorrentParsing = async (categoryName, torrent, mediaType) => {
	return new Promise(async (resolve, reject) => {
		const olderTorrent = await Media.findOne({ magnet: torrent.magnet })
		if (olderTorrent) {
			olderTorrent.seeders = torrent.seeders
			olderTorrent.leechers = torrent.leechers
			await olderTorrent.save()
			return resolve(olderTorrent)
		}
		torrent.name = Utils.beautifyTorrentName(torrent.name)

		const media = new Media({
			displayName: torrent.name,
			magnet: torrent.magnet,
			status: 'listed',
			source: 'ThePirateBay',
			mediaType: categoryName,
			seeders: torrent.seeders,
			leechers: torrent.leechers
		})

		await MetadatasHelper.fetchMetadatas(media, false, mediaType)
		return resolve(media)
	})
}

const crawl = async (category, categoryName, limit, mediaType) => {
	return new Promise(async (resolve, reject) => {
		console.log('[Crawler - ThePirateBay]', 'Started for category', category, '-', categoryName)
		try {
			const mirror = await getNewMirror()

			const html = await downloadHtml(mirror, category)
			let torrents = await parseHtml(html)

			if (limit && limit !== -1) {
				torrents = torrents.slice(0, limit)
			}

			const promises = []
			torrents.forEach((t) => {
				promises.push(finishTorrentParsing(categoryName, t, mediaType))
			})

			const result = await Promise.all(promises)
			console.log('[Crawler - ThePirateBay]', 'Finished for category', category, '-', categoryName)
			return resolve(result.filter(item => item))
		} catch(err) {
			console.log('[Crawler - ThePirateBay]', err)
			return reject(err)
		}
	})
}

module.exports = {
	crawl
}

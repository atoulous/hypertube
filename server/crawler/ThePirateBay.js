'use strict'

const request = require('request'),
	htmlparser = require("htmlparser2"),
	Media = require('../models/Media'),
	Utils = require('./utils'),
	config = {default: {
	  movieDbApiKey: 'd322868ef91d1fef2ba68c167a37c56a'
  	}},
	MovieDB = require('moviedb')(config.default.movieDbApiKey)


const mirrorList = Utils.shuffle([
	'https://pirateproxy.sh',
	'https://thepiratebay-org.prox.space',
	'https://cruzing.xyz',
	'https://tpbproxy.nl',
	'https://thepiratebay.rocks',
	'https://proxydl.cf',
])

const selectMirror = async() => {
	return new Promise((resolve, reject) => {
		mirrorList.forEach((mirror) => {
			request(mirror, { method: 'HEAD' }, async (err, res) => {
				if (!err && res && (res.statusCode >= 200 && res.statusCode <= 299)) {
					return resolve(mirror)
				}
			})
		})
	})
}

const downloadHtml = async (host, url) => {
	return new Promise(async (resolve, reject) => {
		request(host + url, async (err, res, body) => {
			if (err) return reject(err)
			if (res.statusCode < 200 || res.statusCode > 299) {
				// The mirror crapped its pants. Pick a new one and restart operation
				const newMirror = await selectMirror()
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

const getMediaMetadata = (mediaName) => {
	return new Promise((resolve, reject) => {
		MovieDB.searchMovie({ query: mediaName }, async (mDbErr, mDbRes) => {
			if (mDbErr && mDbErr.status === 429 && mDbErr.response.header['retry-after']) {
				// We hit the rate limit, re-call this function after the delay
				await Utils.timeout(parseInt(mDbErr.response.header['retry-after'], 10) / 1000)
				const response = await getMediaMetadata(mediaName)
				return resolve(response)
			}

			const mdbData = (mDbErr || !mDbRes || !mDbRes.results || !mDbRes.results[0]) ? null : mDbRes.results[0]

			// No response from TheMovieDB, set the metadata to a null
			if (!mdbData) return resolve(null)

			// We found the data, return it!
			return resolve({
				name: mdbData.title,
				posterPath: mdbData.poster_path,
				backdropPath: mdbData.backdrop_path,
				overview: mdbData.overview
			})
		})
	})
}

const crawl = async () => {
	return new Promise(async (resolve, reject) => {
		console.log('[Crawler - ThePirateBay]', 'Start')
		try {
			const mirror = await selectMirror()
			const html = await downloadHtml(mirror, '/top/200')
			const torrents = await parseHtml(html)

			let i = 0
			torrents.map(async (torrent) => {
				const olderTorrent = await Media.findOne({ magnet: torrent.magnet })
				if (olderTorrent) {
					olderTorrent.seeders = torrent.seeders
					olderTorrent.leechers = torrent.leechers
					await olderTorrent.save()
					return
				}

				torrent.name = Utils.beautifyTorrentName(torrent.name)
				const metadatas = await getMediaMetadata(torrent.name)
				const media = new Media({
					displayName: torrent.name,
					magnet: torrent.magnet,
					status: 'listed',
					source: 'ThePirateBay',
					seeders: torrent.seeders,
					leechers: torrent.leechers,
					metadatas: metadatas
				})
				await media.save()
			})
			return resolve()
		} catch(err) {
			return reject('[Crawler - ThePirateBay] ' + err)
		}
	})
}

module.exports = {
	crawl
}

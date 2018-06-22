'use strict'

const request = require('request'),
	htmlparser = require("htmlparser2"),
	Media = require('../models/Media'),
	Utils = require('./utils'),
	MetadatasHelper = require('./MetadatasHelper')


const fetchHtml = async (uri) => {
	return new Promise(async (resolve, reject) => {
		request(uri, async (err, res, body) => {
			if (err) return reject(err)
			if (res.statusCode < 200 || res.statusCode > 299) {
				return reject(body)
			}
			return resolve(body)
		})
	})
}

const downloadHtml = async (host, url) => {
	return new Promise(async (resolve, reject) => {
		const html = await fetchHtml(host + url).catch(() => {
			return resolve(downloadHtml(host, url))
		})
		return resolve(html)
	})
}

const parseHtml = async (html) => {
	return new Promise((resolve, reject) => {
		const torrentsArray = []
		let currentTorrent = {}
		let grab = null

		var parser = new htmlparser.Parser({
			onopentag: (name, attribs) => {
				if (name === 'a' && attribs.href && attribs.href.startsWith('/torrent/')) {
					grab = 'name'
					currentTorrent.tmpUrl = attribs.href
				} else if (name === 'td' && attribs.class && attribs.class.indexOf('seeds') !== -1) {
					grab = 'seeders'
				} else if (name === 'td' && attribs.class && attribs.class.indexOf('leeches') !== -1) {
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

const parseMagnetFromPage = async(html) => {
	return new Promise((resolve, reject) => {
		var parser = new htmlparser.Parser({
			onopentag: (name, attribs) => {
				if (name === 'a' && attribs.href && attribs.href.startsWith('magnet:?')) {
					return resolve(attribs.href)
				}
			}, onerror: (err) => {
				return reject(err)
			}}, {
				decodeEntities: true
		})
		parser.write(html)
		parser.end()
	})
}

const getMagnet = async (torrent, mirror) => {
	return new Promise(async (resolve, reject) => {
		const html = await fetchHtml(mirror + torrent)
		const magnet = await parseMagnetFromPage(html)

		return resolve(magnet)
	})
}

const finishTorrentParsing = async (categoryName, mirror, torrent, doFetchMetadatas, mediaType) => {
	return new Promise(async (resolve, reject) => {
		torrent.magnet = await getMagnet(torrent.tmpUrl, mirror)

		const olderTorrent = await Media.findOne({ magnet: torrent.magnet })
		if (olderTorrent) {
			return resolve(olderTorrent)
		}

		torrent.name = Utils.beautifyTorrentName(torrent.name)
		const media = new Media({
			displayName: torrent.name,
			magnet: torrent.magnet,
			status: 'listed',
			source: '1337x',
			mediaType: categoryName,
			seeders: torrent.seeders,
			leechers: torrent.leechers
		})

		await MetadatasHelper.fetchMetadatas(media, doFetchMetadatas, mediaType)
		await media.save()
		return resolve(media)
	})
}

const crawl = async (category, categoryName, limit, doFetchMetadatas, mediaType) => {
	return new Promise(async (resolve, reject) => {
		console.log('[Crawler - 1337x]', 'Started for category', category, '-', categoryName)
		try {
			const mirror = 'http://1337x.to'
			const html = await downloadHtml(mirror, category)

			let torrents = await parseHtml(html)

			if (limit && limit !== -1) {
				torrents = torrents.slice(0, limit)
			}

			const promises = []
			torrents.forEach((t) => {
				promises.push(finishTorrentParsing(categoryName, mirror, t, doFetchMetadatas, mediaType))
			})

			const result = await Promise.all(promises)
			console.log('[Crawler - 1337x]', 'Finished for category', category, '-', categoryName)
			return resolve(result.filter(item => item))
		} catch(err) {
			console.log(err)
			throw err
		}
	})
}

module.exports = {
	crawl
}

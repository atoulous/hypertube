'use strict'

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs')
const torrentStream = require('torrent-stream')
const Media = require('../models/Media')
const config = require('../config')

const downloadTorrent = async (media) => {
	return new Promise(async (resolve, reject) => {
		try {
			const inputStream = await startTorrent(media.magnet)
			await startTranscode(inputStream, media)
			media.status = 'downloading'
			await media.save()
			console.log('all done')
			return resolve()
		} catch(e) {
			console.log('Catched', e)
			return reject(e)
		}
	})
}

async function startTorrent(magnet) {
	console.log('startTorrent()')
	return new Promise((resolve, reject) => {
		const engine = torrentStream(magnet)
		engine.on('ready', () => {
			engine.files.sort((a, b) => { return a.length < b.length })
			console.log('torrent engine ready, selected file is', engine.files[0].name)
			const readStream = engine.files[0].createReadStream()
			console.log('Stream openned, resolving in 10s.')
			setTimeout(() => {
				console.log('timeout over, resolve now')
				return resolve(readStream)
			}, 10000)

		})
	})
}

async function startTranscode(inputStream, media) {
	return new Promise((resolve, reject) => {
		console.log('Transcoding started')
		fs.mkdirSync(__dirname + '/streams/' + media._id)

		ffmpeg(inputStream)
			.videoBitrate(1024)
			.videoCodec('libx264')
			.audioBitrate('128k')
			.audioCodec('aac')
			.audioChannels(2)
			.addOption('-hls_time', 2)
			.addOption('-hls_playlist_type', 'vod')
			.addOption('-start_number', '0')
			.addOption('-hls_base_url', 'http://127.0.0.1:' + config.default.port + '/' + media._id + '/')
			.addOption('-hls_list_size', 0)
			.addOption('-f', 'hls')
			.on('start', (command) => {
				console.log('Ffmpeg started with command', command)
				return resolve()
			}).on('end', function() {
				console.log('Ffmpeg is done converting target', media._id);
				media.status = 'downloaded'
				media.save()
			}).on('error', function(err) {
				console.log('Ffmpeg error for target', media._id, 'error is:', err);
				return reject(err.message)
			}).save(__dirname + '/streams/' + media._id + '/stream.m3u8');
	})
}

module.exports = {
	downloadTorrent
}

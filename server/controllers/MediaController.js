const ffmpeg = require('fluent-ffmpeg')
const ffprobe = require('node-ffprobe')
const fs = require('fs')
const torrentStream = require('torrent-stream')
const Media = require('../models/Media')
const config = require('../config')

const delay = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

// Determines the length of the media, in decimal seconds
async function getMediaLength(targetFilename) {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProbe = async () => {
				console.log('GetMediaLength', 'Checking probe status')
				ffprobe(targetFilename, async (err, probeData) => {
					if (err) {
						console.log('GetMediaLength', 'Probe failed. Retrying in 2000ms')
						setTimeout(checkProbe, 2000)
						return
					}
					console.log('GetMediaLength', 'Probe succeeded. Media length is', probeData.format.duration)
					fs.unlinkSync(filePath)
					engine.destroy(() => {
						console.log('GetMediaLength', 'Engine destroyed. Resolving')
						return resolve(probeData.format.duration)
					})
				})
			}
			setTimeout(checkProbe, 2000)
		} catch (e) {
			return reject(e)
		}
	})
}

// Starts the download, returns a stream to the data
async function startTorrent(magnet) {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('startTorrent()')
			const engine = torrentStream(magnet)
			console.log(magnet)
			engine.on('ready', async () => {
				engine.files.sort((a, b) => a.length < b.length)
				const targetFilename = __dirname + '/streams/' + media._id + '/' + engine.files[0].name

				console.log('startTorrent', 'torrent engine ready, selected file is', engine.files[0].name)
				const readStream = engine.files[0].createReadStream()
				const writeStream = fs.createWriteStream(targetFilename)
				readStream.pipe(writeStream)

				console.log('startTorrent', 'Stream openned, resolving, file is', targetFilename)
				return resolve(targetFilename)
			})
		} catch (e) {
			return reject(e)
		}
	})
}

// Generates a "fake" playlist with the appropriate number of segments.
// Useful to trick the clients into thinking that the video is of a
// specific length.
async function generateMasterPlaylist(duration, media) {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('Started building the master playlist')
			// Writing the playlist header
			const writeStream = fs.createWriteStream(__dirname + '/streams/' + media._id + '/ps.m3u8')
			writeStream.write('#EXTM3U\n')
			writeStream.write('#EXT-X-VERSION:3\n')
			writeStream.write('#EXT-X-TARGETDURATION:10\n')
			writeStream.write('#EXT-X-MEDIA-SEQUENCE:0\n')
			writeStream.write('#EXT-X-PLAYLIST-TYPE:VOD\n')

			// Writing the streams list
			let streamCount = 0
			while (duration >= 10.0) {
				writeStream.write('#EXTINF:9.550000,\n')
				writeStream.write(`http://127.0.0.1:${config.default.port}/${media._id}/stream${streamCount}.ts\n`)
				streamCount += 1
				duration -= 9.55
			}
			writeStream.write('#EXT-X-ENDLIST\n')
			writeStream.end()

			console.log('Finished building the master playlist.')
			return resolve()
		} catch (e) {
			return reject(e)
		}
	})
}

// Transcodes the stream into an HLS playlist
async function startTranscode(filename, media, piece) {
	return new Promise((resolve, reject) => {
		try {
			console.log('Transcoding started for job #', media._id, '@', piece)

			ffmpeg(filename)
			// Use the original video codec
			.videoCodec('copy')
			// Use 64k AAC for the audio
			.audioBitrate('64k')
			.audioCodec('aac')

			// Generate 10s long HLS segments
			.addOption('-hls_time', 10)
			// Set to VOD, allow scrubbing and keeps older fragments in the manifest
			.addOption('-hls_playlist_type', 'vod')
			// Start at fragment 0
			.addOption('-start_number', piece)
			// Url to prepend to each fragment
			.addOption('-hls_base_url', `http://127.0.0.1:${config.default.port}/${media._id}/`)
			// Set the list size to 0 = infinite
			.addOption('-hls_list_size', 0)
			// Output format is HLS
			.addOption('-f', 'hls')
			// Constant rate factor, quality setting
			.addOption('-crf', '20')
			// Allow to split fragments at non-key frames (allows fragments to be the SAME legth)
			.addOption('-hls_flags', 'split_by_time')
			// Forces the keyframes interval (allows fragments to be the SAME legth)
			.addOption('-force_key_frames', 'expr:gte(t,n_forced*3)')
			// Use 4 cores
			.addOption('-threads', '4')
			.on('start', (command) => {
				console.log('Ffmpeg started with command', command)
				return resolve()
			})
			// .on('end', function() {
			// 	console.log('Ffmpeg is done converting target', media._id)
			// 	// Replace our 'estimates' playlist with the actual one
			// 	fs.unlinkSync(__dirname + '/streams/' + media._id + '/ps.m3u8')
			// 	fs.renameSync(__dirname + '/streams/' + media._id + '/stream.m3u8', __dirname + '/streams/' + media._id + '/ps.m3u8')
			// 	media.status = 'downloaded'
			// 	media.save()
			// })
			.on('error', function(err) {
				console.log('Ffmpeg error for target', media._id, 'error is:', err);
				return reject(err.message)
			}).save(__dirname + '/streams/' + media._id + '/stream.m3u8');
		} catch (e) {
			return reject(e)
		}
	})
}

// Starts the download process.
const downloadTorrent = async (media) => {
	return new Promise(async (resolve, reject) => {
		try {
			fs.mkdirSync(__dirname + '/streams/' + media._id)

			const targetFilename = await startTorrent(media.magnet)
			const mediaLength = await getMediaLength(targetFilename)

			console.log('Waiting 10s for the torrent to start downloading.')
			await delay(10000)
			console.log('5s are up.')

			await generateMasterPlaylist(mediaLength, media)
			await startTranscode(targetFilename, media, 0)
			media.status = 'downloading'
			await media.save()

			console.log('Waiting 10s for the transcoding to start.')
			await delay(10000)
			console.log('10s are up.')

			return resolve()
		} catch(e) {
			console.log('Catched', e)
			throw e
			return reject(e)
		}
	})
}

module.exports = {
	downloadTorrent
}

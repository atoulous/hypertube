const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('node-ffprobe');
const fs = require('fs');
const torrentStream = require('torrent-stream');
const config = require('../config');

const delay = async ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// Determines the length of the media, in decimal seconds
async function parseMedia(magnet) {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('ParseMedia()')
			const engine = torrentStream(magnet)
			engine.on('ready', async () => {
				engine.files.sort((a, b) => a.length < b.length)
				const fileName = engine.files[0].name
				const filePath = __dirname + '/streams/' + fileName

				console.log('ParseMedia', 'torrent engine ready, selected file is', fileName)
				const readStream = engine.files[0].createReadStream()
				const writeStream = fs.createWriteStream(filePath)
				readStream.pipe(writeStream)

				const checkProbe = async () => {
					console.log('ParseMedia', 'Checking probe status')
					ffprobe(filePath, async (err, probeData) => {
						if (err) {
							console.log('ParseMedia', 'Probe failed. Retrying in 2000ms')
							setTimeout(checkProbe, 2000)
							return
						}
						let i = 0
						const srtArr = []
						probeData.streams.forEach((stream) => {
							if (stream.codec_type === 'subtitle') {
								srtArr.push({
									index: i,
									name: stream['TAG:language'] || i
								})
							}
							i++
						})
						console.log('ParseMedia', 'SRT data is', srtArr)
						console.log('ParseMedia', 'Probe succeeded. Media length is', probeData.format.duration)
						fs.unlinkSync(filePath)
						engine.destroy(() => {
							console.log('ParseMedia', 'Engine destroyed. Resolving')
							return resolve( [ probeData.format.duration, srtArr ] )
						})
					})
				}
				setTimeout(checkProbe, 2000)
			})
		} catch (e) {
			return reject(e)
		}
	})
}

// Starts the download, returns a stream to the data
async function startTorrent(magnet) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('startTorrent()');
      const engine = torrentStream(magnet);
      engine.on('ready', async () => {
        engine.files.sort((a, b) => a.length < b.length);

        console.log('startTorrent', 'torrent engine ready, selected file is', engine.files[0].name);
        const readStream = engine.files[0].createReadStream();
        console.log('startTorrent', 'Stream openned, resolving');
        return resolve(readStream);
      });
    } catch (e) {
      return reject(e);
    }
  });
}

// Generates a "fake" playlist with the appropriate number of segments.
// Useful to trick the clients into thinking that the video is of a
// specific length.
async function generateMasterPlaylist(duration, media, srtArr) {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('Started building the master playlist')
			const masterWriteStream = fs.createWriteStream(__dirname + '/streams/' + media._id + '/master.m3u8')
			masterWriteStream.write('#EXTM3U\n')

			if (srtArr.length !== 0) {
				masterWriteStream.write(`#EXT-X-MEDIA:URI="http://127.0.0.1:${config.default.port}/api/media/${media._id}/stream_vtt.m3u8",TYPE=SUBTITLES,GROUP-ID="subs",LANGUAGE="en",NAME="English",DEFAULT=NO,FORCED=NO`)
				masterWriteStream.write('\n')
			}
			masterWriteStream.write('#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1533000,RESOLUTION=854x480,CODECS="avc1.4d001f, mp4a.40.5",SUBTITLES="subs"\n')
			masterWriteStream.write(`http://127.0.0.1:${config.default.port}/api/media/${media._id}/ps.m3u8`)
			masterWriteStream.write('\n')
			masterWriteStream.end()

			console.log('Finished building the video playlist - Started building the video playlist')


			// Writing the playlist header
			const writeStream = fs.createWriteStream(__dirname + '/streams/' + media._id + '/ps.m3u8')
			writeStream.write('#EXTM3U\n')
			writeStream.write('#EXT-X-VERSION:3\n')
			writeStream.write('#EXT-X-TARGETDURATION:10\n')
			writeStream.write('#EXT-X-MEDIA-SEQUENCE:0\n')
			writeStream.write('#EXT-X-PLAYLIST-TYPE:VOD\n')

      // Writing the streams list
      let streamCount = 0;
      while (duration >= 10.0) {
        writeStream.write('#EXTINF:9.550000,\n');
        writeStream.write(`http://127.0.0.1:${config.default.port}/api/media/${media._id}/stream${streamCount}.ts\n`);
        streamCount += 1;
        duration -= 9.55;
      }
      writeStream.write('#EXT-X-ENDLIST\n');
      writeStream.end();

			console.log('Finished building the video playlist.')
			return resolve()
		} catch (e) {
			return reject(e)
		}
	})
}

// Transcodes the stream into an HLS playlist
async function startTranscode(inputStream, media) {
  return new Promise((resolve, reject) => {
    try {
      console.log('Transcoding started');

			const command = ffmpeg(inputStream)
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
			.addOption('-start_number', '0')
			// Url to prepend to each fragment
			.addOption('-hls_base_url', `http://127.0.0.1:${config.default.port}/api/media/${media._id}/`)
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
			.output(__dirname + '/streams/' + media._id + '/stream.m3u8')
			.on('start', (command) => {
				console.log('Ffmpeg started with command', command)
				return resolve()
			}).on('end', function() {
				console.log('Ffmpeg is done converting target', media._id)
				// Replace our 'estimates' playlist with the actual one
				fs.unlinkSync(__dirname + '/streams/' + media._id + '/ps.m3u8')
				fs.renameSync(__dirname + '/streams/' + media._id + '/stream.m3u8', __dirname + '/streams/' + media._id + '/ps.m3u8')
			}).on('error', function(err) {
				console.log('Ffmpeg error for target', media._id, 'error is:', err);
				return reject(err.message)
			}).run()
		} catch (e) {
			return reject(e)
		}
	})
}

// Starts the download process.
const downloadTorrent = async media => new Promise(async (resolve, reject) => {
  try {
  	const pathToStream = `${__dirname}/streams/${media._id}`;
    if (!fs.existsSync(pathToStream)) fs.mkdirSync(pathToStream);

			const [ mediaLength, srtArr ] = await parseMedia(media.magnet)
			console.log(mediaLength, srtArr)
			const inputStream = await startTorrent(media.magnet)

    console.log('Waiting 10s for the torrent to start downloading.');
    await delay(10000);
    console.log('5s are up.');

			await generateMasterPlaylist(mediaLength, media, srtArr)
			await startTranscode(inputStream, media)
			media.status = 'downloading'
			await media.save()

    console.log('Waiting 10s for the transcoding to start.');
    await delay(10000);
    console.log('10s are up.');

    return resolve();
  } catch (e) {
    console.log('Catched', e);
    return reject(e);
  }
});

module.exports = {
  downloadTorrent,
};

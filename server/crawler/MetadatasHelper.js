const Utils = require('./utils'),
	config = {default: {
		movieDbApiKey: 'd322868ef91d1fef2ba68c167a37c56a'
	}},
	MovieDB = require('moviedb')(config.default.movieDbApiKey)

const fetchCast = async (id, mediaType) => {
	return new Promise((resolve, reject) => {
		const mediaCallback = async (mDbErr, mdbRes) => {
			if (mDbErr && mDbErr.status === 429 && mDbErr.response.header['retry-after']) {
				// We hit the rate limit, re-call this function after the delay
				await Utils.timeout(parseInt(mDbErr.response.header['retry-after'], 10) / 1000)
				const response = await fetchCast(id, mediaType)
				return resolve(response)
			}

			if (mDbErr) return reject(mDbErr)
			if (!mdbRes) return resolve(null)

			mdbRes.crew = mdbRes.crew.splice(0, 6)
			mdbRes.cast = mdbRes.cast.splice(0, 6)
			return resolve(mdbRes)
		}

		if (mediaType === 'tv') {
			MovieDB.tvCredits( { id: id }, mediaCallback)
		} else {
			MovieDB.movieCredits( { id: id }, mediaCallback)
		}
	})
}

const fetchMetadata = async (id, mediaType) => {
	return new Promise((resolve, reject) => {
		const mediaCallback = async (mDbErr, mdbRes) => {
			if (mDbErr && mDbErr.status === 429 && mDbErr.response.header['retry-after']) {
				// We hit the rate limit, re-call this function after the delay
				await Utils.timeout(parseInt(mDbErr.response.header['retry-after'], 10) / 1000)
				const response = await fetchMetadata(id, mediaType)
				return resolve(response)
			}

			if (mDbErr) return reject(mDbErr)
			if (!mdbRes) return resolve(null)
			return resolve(mdbRes)
		}

		if (mediaType === 'tv') {
			MovieDB.tvInfo( { id: id }, mediaCallback)
		} else {
			MovieDB.movieInfo( { id: id }, mediaCallback)
		}
	})
}

const getMediaInfo = async (mediaName, mediaType) => {
	return new Promise((resolve, reject) => {
		const mediaCallback = async (mDbErr, mdbRes) => {
			if (mDbErr && mDbErr.status === 429 && mDbErr.response.header['retry-after']) {
				// We hit the rate limit, re-call this function after the delay
				await Utils.timeout(parseInt(mDbErr.response.header['retry-after'], 10) / 1000)
				const response = await getMediaInfo(mediaName, mediaType)
				return resolve(response)
			}

			if (mDbErr) return reject(mDbErr)
			if (!mdbRes || !mdbRes.total_results || mdbRes.total_results === 0 || !mdbRes.results) return resolve(null)

			return resolve(mdbRes.results[0])
		}

		if (mediaType === 'tv') {
			MovieDB.searchTv({ query: mediaName }, mediaCallback)
		} else {
			MovieDB.searchMovie({ query: mediaName }, mediaCallback)
		}
	})
}

const fetchMetadatas = async (media, doFetchExtendedDatas, mediaType) => {
	return new Promise(async (resolve, reject) => {
		if (doFetchExtendedDatas && media.movieDbId && media.metadatas && !media.hasExtendedMetadatas) {
			// Fetch extended metadatas (ie cast, crew, ...) if the media already has
			// basic metadatas.

			const metadatas = await fetchMetadata(media.movieDbId, mediaType)
			if (!metadatas) {
				media.metadatas = null
				await media.save()
				return resolve(media)
			}
			const cast = await fetchCast(media.movieDbId, mediaType)
			media.metadatas.productionDate = metadatas.release_date
			media.metadatas.duration = metadatas.runtime
			media.metadatas.tagline = metadatas.tagline

			if (cast && cast.cast && cast.cast.length !== 0)
				media.metadatas.cast = cast.cast

			if (cast && cast.crew && cast.crew.length !== 0)
				media.metadatas.crew = cast.crew
			media.hasExtendedMetadatas = true
			await media.save()
			return resolve(media)
		} else if (!doFetchExtendedDatas && !media.hasExtendedMetadatas) {
			let searchTerm = media.displayName
			if (mediaType === 'tv') {
				searchTerm = media.displayName.replace(/(S[0-9]{1,2}E[0-9]{1,2})(.*)/gi, '')
				searchTerm = media.displayName.replace(/(S[0-9]{1,2})(.*)/gi, '')
			}

			const mediaInfo = await getMediaInfo(searchTerm, mediaType)
			if (!mediaInfo) {
				console.log('no match', media.displayName, mediaType)
				media.metadatas = null
				media.movieDbId = null
				await media.save()
				return resolve(media)
			}
			const mediaId = mediaInfo.id

			mediaInfo.posterPath = mediaInfo.poster_path
			mediaInfo.backdropPath = mediaInfo.backdrop_path
			mediaInfo.name = mediaInfo.title
			mediaInfo.score = mediaInfo.vote_average
			if (!mediaInfo.name) {
				mediaInfo.name = media.displayName
			}
			media.metadatas = mediaInfo
			media.movieDbId = mediaInfo.id
			await media.save()
			return resolve(media)
		}

		return resolve(media)
	})
}

module.exports = {
	fetchMetadatas
}

// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/hypertube');
//
// const Media = require('../models/Media')
//
// const a = async () => {
// 	const media = await Media.findOne({ _id: '5b2d2980840aad4545c56304' })
//
// 	await fetchMetadatas(media, false, 'movie')
// 	await fetchMetadatas(media, true, 'movie')
//
// 	console.log('s',media)
// }
// a()

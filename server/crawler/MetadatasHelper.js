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

const getMediaId = async (mediaName, mediaType) => {
	return new Promise((resolve, reject) => {
		const mediaCallback = async (mDbErr, mdbRes) => {
			if (mDbErr && mDbErr.status === 429 && mDbErr.response.header['retry-after']) {
				// We hit the rate limit, re-call this function after the delay
				await Utils.timeout(parseInt(mDbErr.response.header['retry-after'], 10) / 1000)
				const response = await getMediaId(mediaName, mediaType)
				return resolve(response)
			}

			if (mDbErr) return reject(mDbErr)
			if (!mdbRes || !mdbRes.total_results || mdbRes.total_results === 0 || !mdbRes.results) return resolve(null)

			return resolve(mdbRes.results[0].id)
		}

		if (mediaType === 'tv') {
			MovieDB.searchTv({ query: mediaName }, mediaCallback)
		} else {
			MovieDB.searchMovie({ query: mediaName }, mediaCallback)
		}
	})
}

const fetchMetadatas = async (media, doFetchMetadatas, mediaType) => {
	return new Promise(async (resolve, reject) => {
		if (doFetchMetadatas) {

			let searchTerm = media.displayName
			if (mediaType === 'tv') {
				searchTerm = media.displayName.replace(/(S[0-9]{1,2}E[0-9]{1,2})(.*)/gi, '')
				searchTerm = media.displayName.replace(/(S[0-9]{1,2})(.*)/gi, '')
			}

			const mediaId = await getMediaId(searchTerm, mediaType)
			if (!mediaId) {
				console.log('no match', media.displayName, mediaType)
				media.metadatas = null
				return resolve(media)
			}

			const metadatas = await fetchMetadata(mediaId, mediaType)
			if (!metadatas) {

				media.metadatas = null
				return resolve(media)
			}

			const cast = await fetchCast(mediaId, mediaType)

			metadatas.posterPath = metadatas.poster_path
			metadatas.backdropPath = metadatas.backdrop_path
			metadatas.name = metadatas.title
			if (!metadatas.name) {
				metadatas.name = media.displayName
			}
			metadatas.score = metadatas.vote_average
			metadatas.productionDate = metadatas.release_date
			metadatas.duration = metadatas.runtime

			if (cast && cast.cast && cast.cast.length !== 0)
				metadatas.cast = cast.cast

			if (cast && cast.crew && cast.crew.length !== 0)
				metadatas.crew = cast.crew

			media.metadatas = metadatas
			media.needFetchMetadata = false
			return resolve(media)
		} else {
			media.needFetchMetadata = true
			media.metadatas = null
			return resolve(media)
		}
	})
}

module.exports = {
	fetchMetadatas
}
//
// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/hypertube');
//
// const Media = require('./models/Media')
//
// const a = async () => {
// 	const media = await Media.findOne({ _id: '5b240d8327bdbcf7084222c7' })
//
// 	await MetadataFetcher(media, true, 'movie')
// 	console.log(media)
// }
// a()

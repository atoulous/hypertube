const Utils = require('./utils'),
	config = {default: {
		movieDbApiKey: 'd322868ef91d1fef2ba68c167a37c56a'
	}},
	MovieDB = require('moviedb')(config.default.movieDbApiKey)

import moment from 'moment-timezone';

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

			mdbRes.crew = mdbRes.crew.splice(0, 20)
			mdbRes.cast = mdbRes.cast.splice(0, 20)
			return resolve(mdbRes)
		}

		if (mediaType !== 'tv') {
			MovieDB.movieCredits( { id: id, language:'en' }, mediaCallback)
		} else {
			MovieDB.tvCredits( { id: id, language:'en' }, mediaCallback)
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
			MovieDB.tvInfo( { id: id, language:'en' }, mediaCallback)
		} else {
			MovieDB.movieInfo( { id: id, language:'en' }, mediaCallback)
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
			MovieDB.searchTv({ query: mediaName, language:'en' }, mediaCallback)
		} else {
			MovieDB.searchMovie({ query: mediaName, language:'en' }, mediaCallback)
		}
	})
}

const appendShowMetadatas = async (media, showId, season, episode) => {
	return new Promise(async (resolve, reject) => {
		MovieDB.tvEpisodeInfo({
			id: showId,
			season_number: season,
			episode_number: episode
		}, async (err, res) => {
			if (err) return reject(err)

			MovieDB.tvEpisodeCredits({
				id: showId,
				season_number: season,
				episode_number: episode
			}, async (errCredits, resCredits) => {
				if (errCredits) return reject(errCredits)

				media.metadatas.isEpisode = true
				media.metadatas.episodeGuestStars = resCredits.guest_stars
				media.metadatas.productionDate = res.air_date || media.metadatas.productionDate

				media.metadatas.overview = res.overview || media.metadatas.overview
				if (res.name)
					media.metadatas.name = media.displayName + ' - ' + res.name

				media.metadatas.backdropPath = res.still_path || media.metadatas.backdropPath
				media.metadatas.score = res.vote_average || media.metadatas.score

				if (resCredits.crew && resCredits.crew.length !== 0)
					media.metadatas.crew = resCredits.crew.splice(0, 20)

				if (resCredits.cast && resCredits.cast.length !== 0)
					media.metadatas.cast = resCredits.cast.splice(0, 20)

				return resolve()
			})
		})
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

			// Looking for SxxEyy
			const regEx = new RegExp(/(.+)S([0-9]{1,2})E([0-9]{1,2}).*/gi)
			if (regEx.test(media.displayName)) {
				// We found one, get details on that specific episode
				regEx.lastIndex = 0
				const result = regEx.exec(media.displayName)
				// const showName = result[1]
				const season = parseInt(result[2], 10)
				const episode = parseInt(result[3], 10)

				await appendShowMetadatas(media, media.movieDbId, season, episode)
			}

			media.hasExtendedMetadatas = true
			await media.save()
			return resolve(media)
		} else if (!doFetchExtendedDatas && !media.hasExtendedMetadatas) {
			let searchTerm = media.displayName
			if (mediaType === 'tv') {
				// searchTerm = media.displayName.replace(/(S[0-9]{1,2})(.*)/gi, '')
				searchTerm = media.displayName.replace(/(S[0-9]{1,2}E[0-9]{1,2})(.*)/gi, '')
			}
			const mediaInfo = await getMediaInfo(searchTerm, mediaType)
			if (!mediaInfo) {
				console.log('no match', media.displayName, mediaType)
				media.metadatas = null
				media.movieDbId = null
				await media.save()
				return resolve(media)
			}
			// const mediaId = mediaInfo.id

			mediaInfo.productionDate = moment().format(mediaInfo.release_date) || moment.format(mediaInfo.first_air_date) || null
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

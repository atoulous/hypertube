'use strict'

const mongoose = require('mongoose')

const MediaSchema = mongoose.Schema({
	displayName: String,
	magnet: String,
	status: {
		type: String,
		enum: [ 'listed', 'downloading', 'ok' ]
	}, mediaType: {
		type: String,
		enum: [ 'movie', 'show' ]
	}, source: String,
	seeders: Number,
	leechers: Number,
	metadatas: {
		name: String,
		posterPath: String,
		backdropPath: String,
		overview: String
	}
})

module.exports = mongoose.model('Media', MediaSchema)

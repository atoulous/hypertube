'use strict'

const mongoose = require('mongoose')

const MediaSchema = mongoose.Schema({
	magnet: String,
	status: {
		type: String,
		enum: [ 'listed', 'downloading', 'ok' ]
	}
})

module.exports = mongoose.model('Media', MediaSchema)

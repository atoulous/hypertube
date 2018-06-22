const mongoose = require('mongoose');

const MediaSchema = mongoose.Schema({
  displayName: String,
  magnet: String,
  status: {
    type: String,
    enum: ['listed', 'downloading'],
  },
  mediaType: {
    type: String,
    enum: ['movie', 'show'],
  },
  source: String,
  seeders: Number,
  leechers: Number,
  needFetchMetadata: Boolean,
  metadatas: {
    name: String,
	tagline: String,
    posterPath: String,
    backdropPath: String,
    overview: String,
	score: String,
	productionDate: String,
	duration: String,
	cast: [{
		character: String,
		name: String,
		profile_path: String
	}], crew: [{
		department: String,
		job: String,
		name: String,
		profile_path: String
	}]
  },
});

module.exports = mongoose.model('Media', MediaSchema);

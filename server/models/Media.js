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
  lastSeen: { type: Date, default: Date.now },
  seeders: Number,
  leechers: Number,
  hasExtendedMetadatas: Boolean,
  movieDbId: String,
  metadatas: {
    name: String,
	tagline: String,
    posterPath: String,
    backdropPath: String,
    overview: String,
	score: String,
	productionDate: String,
	duration: String,
	isEpisode: Boolean,
	episodeGuestStars: [{
		character: String,
		name: String,
		profile_path: String
	}],
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

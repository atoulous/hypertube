const mongoose = require('mongoose');

const CommentsSchema = mongoose.Schema({
  comment: String,
  user: {
      id:Object,
      name: String,
      picture: String
  },
  id_film: Object,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comments', CommentsSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  auth: String,
  idauth: String,
  token: String,
  email: String,
  password: String,
  name: String,
  firstname: String,
  lastname: String,
  picture: String,
  fpassword: String,
  mediasSeen: { type: Array, default: [] },
  language: { type: String, default: 'english' },
});

userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.validPassword = (password, cpassword) => bcrypt.compareSync(password, cpassword);

module.exports = mongoose.model('User', userSchema);

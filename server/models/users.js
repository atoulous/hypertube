var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
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
		language: { type: String, default: 'english' }
})

userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password, cpassword) => {
	return bcrypt.compareSync(password, cpassword);
};

module.exports = mongoose.model('User', userSchema);

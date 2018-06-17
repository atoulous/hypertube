var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String,
		name: String,
		firstname: String,
		lastname: String,
		picture: String,
		fpassword: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String,
		firstname: String,
		lastname: String,
		picture: String
	},
    github: {
        id: String,
        token: String,
        email: String,
        name: String,
        firstname: String,
        lastname: String,
        picture: String
    },
	qd: {
		id: String,
		token: String,
		email: String,
		name: String,
		firstname: String,
		lastname: String,
		picture: String
	}


})

userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password, cpassword) => {
	return bcrypt.compareSync(password, cpassword);
};

module.exports = mongoose.model('User', userSchema);

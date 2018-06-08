var LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var qdStrategy = require('passport-42').Strategy
var Secu = require('../models/secu.js')
var fs = require('fs')

var User = require('./../models/users')

var configAuth = require('./auth')

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})

	// LOCAL sign-in
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'login',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		process.nextTick(() => {
			if (!Secu.verif(req.body.login) || !Secu.verif(req.body.lastname) || !Secu.verif(req.body.firstname) || !Secu.verif(req.body.email) || !Secu.verif(req.body.password) || !Secu.verif(req.file)) {
				return done(null, false, req.flash('signupMessage', 'Complete all sections of the form.'))
			}
			else if (!Secu.isGoodPassword(req.body.password)) {
				return done(null, false, req.flash('signupMessage', 'A strong password consists of a combination of upper and lowercase letters and numbers.'))
			}
			else if (!Secu.isEmail(req.body.email)) {
				return done(null, false, req.flash('signupMessage', 'Incorrect Email.'))
			}
			else {
				User.findOne({ 'local.email' :  email }, (err, user) => {
					if (err)
						return done(err)
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
					} else {
						User.findOne({ 'local.name' :  req.body.login }, (err, user) => {
							if (err)
								return done(err)
							 if (user) {
								return done(null, false, req.flash('signupMessage', 'That login is already taken.'))
							} else {
								var newUser = new User()
								newUser.local.email = req.body.email
								newUser.local.firstname = req.body.firstname
								newUser.local.lastname = req.body.lastname
								newUser.local.name = req.body.login
								newUser.local.password = newUser.generateHash(req.body.password)
								fs.rename(__dirname + '/../uploads/' + req.file.filename, __dirname + '/../uploads/' + req.body.login, (err) => {
									if (err) throw err
								})
								newUser.local.picture = 'http://localhost:8100/uploads/' + req.body.login
								newUser.save((err) => {
									if (err) throw err
									return done(null, newUser)
								})
							}
						})
					}
				})
			}
		})
	}))

	//LOCAL login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		User.findOne({ 'local.email' :  email }, (err, user) => {
			if (err)
				return done(err)
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'))
			if (!user.validPassword(password, user.local.password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
			return done(null, user)
		})
	}))

	//GOOGLE 
	passport.use(new GoogleStrategy({
		clientID        : configAuth.googleAuth.clientID,
		clientSecret    : configAuth.googleAuth.clientSecret,
		callbackURL     : configAuth.googleAuth.callbackURL,
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(() => {
			User.findOne({ 'google.id' : profile.id }, (err, user) => {
				if (err)
					return done(err)
				if (user) {
					return done(null, user)
				} else {
					var newUser = new User()
						console.log(profile)
					newUser.google.id    = profile.id
					newUser.google.token = token
					if (profile._json.nickname)
						newUser.google.name  = profile._json.nickname
					else
						newUser.google.name  = profile.displayName
					newUser.google.firstname  = profile.name.givenName
					newUser.google.lastname  = profile.name.familyName
					newUser.google.email = profile.emails[0].value
					newUser.google.picture = profile.photos[0].value
					newUser.save((err) => {
						if (err) throw err
						return done(null, newUser)
					});
				}
			});
		});
	}));

	//42
	passport.use(new qdStrategy({
		clientID        : configAuth.qdAuth.clientID,
		clientSecret    : configAuth.qdAuth.clientSecret,
		callbackURL     : configAuth.qdAuth.callbackURL,
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(() => {
			User.findOne({ 'qd.id' : profile.id }, (err, user) => {
				if (err)
					return done(err)
				if (user) {
					return done(null, user)
				} else {
					var newUser = new User()
					newUser.qd.id    = profile.id
					newUser.qd.token = token
					newUser.qd.name  = profile.username
					newUser.qd.firstname  = profile.name.givenName
					newUser.qd.lastname  = profile.name.familyName
					newUser.qd.email = profile.emails[0].value
					newUser.qd.picture = profile.photos[0].value
					newUser.save((err) => {
						if (err) throw err
						return done(null, newUser)
					});
				}
			});
		});
	}));
}

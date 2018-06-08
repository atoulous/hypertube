var User = require('./../models/users')
var sendMail = require('./../models/sendmail')
var Secu = require('../models/secu.js')
var urls = 'http://5.196.225.53:8100'

module.exports = (app, passport) => {

	app.get('/', (req, res) => {
		res.render('index.ejs')
	})

	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage') })
	})

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}))



	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}))

	app.get('/signup', (req, res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	})

	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.ejs', {
			user : req.user
		})
	})


	app.post('/profile', isLoggedIn, (req, res) => {
		if (!Secu.verif(req.body.firstname) || !Secu.verif(req.body.lastname) || !Secu.verif(req.body.email)) {
			req.flash('signupMessage', 'Empty form field.')
			res.redirect('/profile')
		}
		else if (!Secu.isEmail(req.body.email)) {
			req.flash('signupMessage', 'Incorrect Email.')
			res.redirect('/profile')
		
		}
		else {
			User.findOne({ 'local.name' :  req.user.local.name}, (err, user) => {
				if (err) throw err
				if (user) {
					user.local.email = req.body.email
					user.local.firstname = req.body.firstname
					user.local.lastname = req.body.lastname
					if (Secu.verif(req.body.password)) {
						if (Secu.isGoodPassword(req.body.password)) {
							user.local.password = user.generateHash(req.body.password)
						}
						else
							req.flash('signupMessage', 'A strong password consists of a combination of upper and lowercase letters and numbers.')
					}
					if (req.file) {
						fs.rename(__dirname + '/../uploads/' + req.file.filename, __dirname + '/../uploads/' + user.local.picture, (err) => {
							if (err) throw err
						})
					}
					user.save((err) => {
						if (err) throw err
						res.render('profile.ejs', {
							user : user
						})
					})
				}
			})

		}
	})

	app.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/')
	})


	//42
	app.get('/auth/qd', passport.authenticate('42', { scope : ['public'] }));
	app.get('/auth/qd/callback', passport.authenticate('42', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}))

	//GOOGLE
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}))

	app.get('/resetpasswd', (req, res) => {
		res.locals.code = req.query.code
		res.render('resetpasswd.ejs')
	})

	app.post('/resetpasswd', (req, res) => {
		if (!Secu.verif(req.query.code)) {
			req.flash('signupMessage', 'Incorect code.')
			res.redirect('/login')
		}
		else if (!Secu.verif(req.body.password) || !Secu.isGoodPassword(req.body.password)) {
			req.flash('signupMessage', 'A strong password consists of a combination of upper and lowercase letters and numbers.')
			res.locals.code = req.query.code
			res.render('resetpasswd.ejs')
		}
		else {
			User.findOne({ 'local.fpassword' :  req.query.code }, (err, user) => {
				if (err) throw err
				if (user) {
					user.local.password = req.body.password
					user.local.fpassword = ''
					req.flash('succes', 'The password was change')
					user.save((err) => {
						if (err) throw err
					})
				}
				else {
					req.flash('signupMessage', 'Incorect code.')
				}
				res.redirect('/login')
			})
		}
	})

	app.get('/fpassword', (req, res) => {
		res.render('fpassword.ejs')
	})

	app.post('/fpassword', (req, res) => {
	if (!Secu.verif(req.body.email) || !Secu.isEmail(req.body.email)) {
		req.flash('signupMessage', 'Incorect Email.')
		res.redirect('/login')
	}
	else {
		var i = 0
		var code = ''
		var tab = "abcdefghijklmnopkrstuvwxyz1234567890"
		while (i < 10)
		{
			var t = Math.floor(Math.random() * (36 - 1) + 1);
			code = code + tab[t]
			i++
		}
		User.findOne({ 'local.email' :  req.body.email }, (err, user) => {
			if (err) throw err
			if (user) {
				user.local.fpassword = user.local.name + code
				var message = 'To reset your password, click this link :  ' + urls + '/resetpasswd?code=' + user.local.name + code
				sendMail.newmail(user.local.email, message, 'Hypertube, reset password')
				req.flash('succes', 'The email was sent')
				user.save((err) => {
					if (err) throw err
				})
				res.redirect('/login')
			} else {
				req.flash('signupMessage', 'Incorrect Email.')
				res.redirect('/login')
			}
		})
	}
	})

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

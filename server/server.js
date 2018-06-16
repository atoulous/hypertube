var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var passport = require('passport')
var flash    = require('connect-flash')
var cookieParser = require('cookie-parser')
var configDB = require('./config/database.js')
var multer  = require('multer')
var upload = multer({ dest: 'server/uploads/' })
var cors = require('cors')

mongoose.connect(configDB.url)

require('./config/passport')(passport); // pass passport for configuration

require('./models/users')

var app = express()
/*var session = Session({
	secret: 'nqwnqw',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
})*/

app.use('/uploads', express.static(__dirname + '/serrver/uploads'))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.single('file'))

// required for passport
app.use(session({
	secret: 'nqwnqw',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes
require('./routes/users.js')(app, passport)

app.listen(process.env.PORT || 5000)


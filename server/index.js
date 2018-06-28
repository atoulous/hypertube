import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import moment from 'moment-timezone';

import config from './config';
import routes from './routes';
import crawler from './crawler/crawler';

moment.tz.setDefault(config.localization.timezone);

const upload = multer({ dest: 'server/uploads/' });
const app = express();

//crawler.startCrawling();
mongoose.connect(config.db.url);

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};

// Middlewares
app.use(morgan('dev'));
app.use('/uploads', express.static(`${__dirname}/uploads`));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.single('file'));


// Passport
app.use(session({
  secret: 'nqwnqw',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
require('./config/passport')(passport);
// pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());


// Routes
require('./routes/users.js')(app, passport);

app.use((req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) { return res.status(403).json({ merror: err, login: false }); }
    if (!user) {
      return res.status(403).json({ merror: 'incorrect user', login: false });
    }
    // if (!user.profile) {
    //   return res.status(401).json({ merror: 'Complete your profile', profile: false, login: true });
    // }
    req.user = user;
    return next();
  })(req, res, next);
});

app.use('/api', routes);


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

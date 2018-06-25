import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import crawler from './crawler/crawler'
import  multer  from 'multer';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';

const upload = multer({ dest: 'server/uploads/'});

const app = express();

// crawler.startCrawling();

const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};


// Middlewares
app.use(morgan('dev'));
app.use('/uploads', express.static(__dirname + '/uploads'));
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
    cookie: {secure: false}
}));
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());



// Routes
require('./routes/users.js')(app, passport);
app.use('/api', routes);



app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
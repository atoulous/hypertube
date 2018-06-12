import express from 'express';

import config from './config';
import mediaRoutes from './routes/media'

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/hypertube')

require('./crawler/crawler').startCrawling()

const app = express(








	
);

// Serve streams files
app.use(express.static(__dirname + '/controllers/streams/'))

app.use('/', mediaRoutes)


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

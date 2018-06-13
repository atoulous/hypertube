import express from 'express';
import morgan from 'morgan'
import config from './config';
import mediaRoutes from './routes/media'

const app = express();
app.use(morgan('dev'))

app.use('/', mediaRoutes)
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/hypertube')

// Serve streams files
app.use(express.static('controllers/streams'))

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

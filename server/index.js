import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import crawler from './crawler/crawler';

const app = express();

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

mongoose.connect(config.db.url);

// crawler.startCrawling();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use('/api', routes);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

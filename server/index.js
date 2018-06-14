import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import config from './config';
import routes from './routes';
import crawler from './crawler/crawler';

const app = express();

mongoose.connect(config.db.url);

crawler.startCrawling();

app.use(morgan('dev'));
app.use('/api', routes);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

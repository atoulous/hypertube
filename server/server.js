import express from 'express';

import config from './config';
import router from './routes';
import mediaRoutes from './routes/media'

const app = express();

app.use('/', mediaRoutes)

// Serve streams files
app.use(express.static('controllers/streams'))


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

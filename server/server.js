import express from 'express';

import config from './config';
import router from './routes';

const app = express();

app.use('/api', router);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

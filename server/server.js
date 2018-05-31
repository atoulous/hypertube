import express from 'express';

import config from './config';

const app = express();

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

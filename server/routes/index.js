import express from 'express';

import media from './media';

const router = express.Router();

/** routes and rendering. */
router.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

router.use('/media', media);

export default router;

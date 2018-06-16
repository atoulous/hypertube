import express from 'express';

import media from './media';

const router = express.Router();

router.use('/media', media);

export default router;

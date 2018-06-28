import express from 'express';

import media from './media';
import profile from './profile';

const router = express.Router();

router.use('/media', media);
router.use('/profile', profile);

export default router;

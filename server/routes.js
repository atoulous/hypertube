import express from 'express';

const router = express.Router();

/** routes and rendering. */
router.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

export default router;

import { Router } from 'express';
import { refreshTokenController } from './RefreshTokenController.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    await refreshTokenController(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
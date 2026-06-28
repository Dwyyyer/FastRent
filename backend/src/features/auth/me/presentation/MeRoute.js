import { Router } from 'express';
import { meController } from './MeController.js';
import { authMiddleware } from '../../../../shared/middleware/AuthMiddleware.js';

const router = Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    await meController(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
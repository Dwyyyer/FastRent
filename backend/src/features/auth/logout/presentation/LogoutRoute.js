import { Router } from 'express';
import { logoutController } from './LogoutController.js';
import { authMiddleware } from '../../../../shared/middleware/AuthMiddleware.js'

const router = Router();

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    await logoutController(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
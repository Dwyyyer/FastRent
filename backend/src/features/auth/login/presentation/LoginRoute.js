import { Router } from 'express';
import { loginController } from './LoginController.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    await loginController(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
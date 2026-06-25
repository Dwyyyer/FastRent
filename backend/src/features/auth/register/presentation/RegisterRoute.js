import { Router } from 'express';
import { registerController } from './RegisterController.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    await registerController(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
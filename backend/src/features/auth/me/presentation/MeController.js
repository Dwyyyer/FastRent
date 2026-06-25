import { pool } from '../../../../shared/database/pool.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { sendResponse } from '../../../../shared/http/SendResponse.js';

export async function meController(req, res) {
  const result = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [req.user.userId]
  );

  const user = result.rows[0];
  if (!user) throw new AppError('Usuário não encontrado', 404);

  return sendResponse(res, 200, { user }, null);
}
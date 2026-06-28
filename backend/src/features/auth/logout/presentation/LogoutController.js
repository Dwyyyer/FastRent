import { pool } from '../../../../shared/database/pool.js';
import { sendResponse } from '../../../../shared/http/SendResponse.js';

export async function logoutController(req, res) {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
  }

  return sendResponse(res, 200, null, 'Logout realizado com sucesso');
}
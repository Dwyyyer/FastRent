import jwt from 'jsonwebtoken';
import { pool } from '../../../../shared/database/pool.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { sendResponse } from '../../../../shared/http/SendResponse.js';
import { env } from '../../../../config/env.js';

export async function refreshTokenController(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token não fornecido', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw new AppError('Refresh token inválido ou expirado', 401);
  }

  const result = await pool.query(
    'SELECT id, user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refreshToken]
  );

  if (result.rows.length === 0) {
    throw new AppError('Refresh token não encontrado ou expirado', 401);
  }

  const userResult = await pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [decoded.userId]
  );

  const user = userResult.rows[0];
  if (!user) throw new AppError('Usuário não encontrado', 404);

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return sendResponse(res, 200, { accessToken }, 'Token renovado com sucesso');
}
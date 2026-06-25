import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../shared/database/pool.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { sendResponse } from '../../../../shared/http/SendResponse.js';
import { requiredFields } from '../../../../shared/validators/RequiredFields.js';
import { env } from '../../../../config/env.js';

export async function loginController(req, res) {
  const { email, password } = req.body;

  requiredFields(req.body, ['email', 'password']);

  const result = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  const user = result.rows[0];

  // Mesmo se não encontrar o user, fazemos o compare para evitar timing attack
  const fakeHash = '$2a$12$invalidhashtopreventtimingattacks.padding.here';
  const passwordToCompare = user ? user.password_hash : fakeHash;
  const validPassword = await bcrypt.compare(password, passwordToCompare);

  if (!user || !validPassword) {
    throw new AppError('E-mail ou senha incorretos', 401);
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  return sendResponse(res, 200, {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email }
  }, 'Login realizado com sucesso');
}
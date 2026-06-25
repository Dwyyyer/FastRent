import bcrypt from 'bcryptjs';
import { pool } from '../../../../shared/database/pool.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { sendResponse } from '../../../../shared/http/SendResponse.js';
import { requiredFields } from '../../../../shared/validators/RequiredFields.js';

export async function registerController(req, res) {
  const { name, email, password } = req.body;

  requiredFields(req.body, ['name', 'email', 'password']);

  if (password.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres', 422);
  }

  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  if (existing.rows.length > 0) {
    throw new AppError('Este e-mail já está cadastrado', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name.trim(), email.toLowerCase().trim(), passwordHash]
  );

  const user = result.rows[0];

  return sendResponse(res, 201, { user }, 'Cadastro realizado com sucesso');
}
import express from 'express';
import cors from 'cors';

import { errorHandler } from './shared/http/ErrorHandler.js';

// Auth routes
import registerRoute from './features/auth/register/presentation/RegisterRoute.js';
import loginRoute from './features/auth/login/presentation/LoginRoute.js';
import refreshTokenRoute from './features/auth/refreshToken/presentation/RefreshTokenRoute.js';
import logoutRoute from './features/auth/logout/presentation/LogoutRoute.js';
import meRoute from './features/auth/me/presentation/MeRoute.js';

import { pool } from './shared/database/pool.js';

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type'],
}));

app.options('*', cors());
app.use(express.json());

function upperCaseKeys(value) {
  if (Array.isArray(value)) return value.map(upperCaseKeys);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key.toUpperCase(),
      upperCaseKeys(item),
    ])
  );
}

function bodyValue(body, field) {
  return body?.[field] ?? body?.[field.toUpperCase()];
}

async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return { rows: upperCaseKeys(result.rows) };
}

function wrap(handler) {
  return (req, res) =>
    Promise.resolve(handler(req, res)).catch((err) => {
      console.error(err);
      res.status(500).json({
        ERROR: 'Internal error',
        DETAILS: String(err.message || err),
      });
    });
}

// ── Auth routes ──────────────────────────────────────────────────────────────
app.use('/api/auth/register', registerRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth/refresh-token', refreshTokenRoute);
app.use('/api/auth/logout', logoutRoute);
app.use('/api/auth/me', meRoute);

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', wrap(async (_, res) => {
  const result = await query('SELECT COUNT(*)::int AS total FROM categories');
  const row = result.rows[0] || {};

  res.json({
    STATUS: 'ok',
    DB_CLIENT: 'postgres',
    CATEGORIES: row.TOTAL ?? 0,
  });
}));

// ── Categories ───────────────────────────────────────────────────────────────
app.get('/api/categories', wrap(async (_, res) => {
  const result = await query('SELECT id, name, description FROM categories ORDER BY id');
  res.json(result.rows);
}));

app.get('/api/categories/:id', wrap(async (req, res) => {
  const result = await query(
    'SELECT id, name, description FROM categories WHERE id = $1',
    [Number(req.params.id)]
  );
  const row = result.rows[0];
  if (!row) return res.status(404).json({ ERROR: 'Not found' });
  res.json(row);
}));

app.post('/api/categories', wrap(async (req, res) => {
  const name = bodyValue(req.body, 'name') ?? '';
  const description = bodyValue(req.body, 'description') ?? null;
  const result = await query(
    'INSERT INTO categories(name, description) VALUES ($1, $2) RETURNING id',
    [name, description]
  );
  res.status(201).json({ ID: result.rows[0]?.ID });
}));

app.put('/api/categories/:id', wrap(async (req, res) => {
  const name = bodyValue(req.body, 'name') ?? '';
  const description = bodyValue(req.body, 'description') ?? null;
  await query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3',
    [name, description, Number(req.params.id)]
  );
  res.json({ UPDATED: true });
}));

app.delete('/api/categories/:id', wrap(async (req, res) => {
  await query('DELETE FROM categories WHERE id = $1', [Number(req.params.id)]);
  res.status(204).send();
}));

// ── Products ─────────────────────────────────────────────────────────────────
app.get('/api/products', wrap(async (_, res) => {
  const result = await query(`
    SELECT p.id, p.category_id, p.name, p.price, p.stock, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ORDER BY p.id
  `);
  res.json(result.rows);
}));

app.get('/api/products/:id', wrap(async (req, res) => {
  const result = await query(
    'SELECT id, category_id, name, price, stock FROM products WHERE id = $1',
    [Number(req.params.id)]
  );
  const row = result.rows[0];
  if (!row) return res.status(404).json({ ERROR: 'Not found' });
  res.json(row);
}));

app.post('/api/products', wrap(async (req, res) => {
  const categoryId = Number(bodyValue(req.body, 'category_id') ?? 0);
  const name = bodyValue(req.body, 'name') ?? '';
  const price = Number(bodyValue(req.body, 'price') ?? 0);
  const stock = Number(bodyValue(req.body, 'stock') ?? 0);
  const result = await query(
    'INSERT INTO products(category_id, name, price, stock) VALUES ($1, $2, $3, $4) RETURNING id',
    [categoryId, name, price, stock]
  );
  res.status(201).json({ ID: result.rows[0]?.ID });
}));

app.put('/api/products/:id', wrap(async (req, res) => {
  const categoryId = Number(bodyValue(req.body, 'category_id') ?? 0);
  const name = bodyValue(req.body, 'name') ?? '';
  const price = Number(bodyValue(req.body, 'price') ?? 0);
  const stock = Number(bodyValue(req.body, 'stock') ?? 0);
  await query(
    'UPDATE products SET category_id = $1, name = $2, price = $3, stock = $4 WHERE id = $5',
    [categoryId, name, price, stock, Number(req.params.id)]
  );
  res.json({ UPDATED: true });
}));

app.delete('/api/products/:id', wrap(async (req, res) => {
  await query('DELETE FROM products WHERE id = $1', [Number(req.params.id)]);
  res.status(204).send();
}));

// ── Error handler (deve ser o último middleware) ──────────────────────────────
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend Node rodando na porta ${port}`);
});
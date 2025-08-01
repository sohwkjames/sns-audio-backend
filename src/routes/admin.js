const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.get('/users', async (req, res) => {
  try {   
      const result = await pool.query(
      'SELECT id, username, is_admin, created_at FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User creation failed' });
  }
})

router.post('/users', async (req, res) => {
  const { username, password, is_admin } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, is_admin)
       VALUES ($1, $2, $3)
       RETURNING id, username, is_admin, created_at`,
      [username, hash, is_admin || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User creation failed' });
  }
});

router.put('/users/:id', async (req, res) => {
  const { username, password, is_admin } = req.body;
  // Cannot update the admin superuser
  if (username === 'admin') {
    return res.status(404).json({ error: 'Cannot modify superuser admin' });
  }
  try {
    const updates = [];
    const values = [];
    let i = 1;

    if (username) {
      updates.push(`username = $${i++}`);
      values.push(username);
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${i++}`);
      values.push(hash);
    }

    if (typeof is_admin === 'boolean') {
      updates.push(`is_admin = $${i++}`);
      values.push(is_admin);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, username, is_admin, created_at`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User update failed' });
  }
});

router.delete('/users/:id', async (req, res) => {
  if (username === 'admin') {
    return res.status(404).json({ error: 'Cannot modify superuser admin' });
  }

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204); // Success, no content
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User deletion failed' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin} = require('./middleware/auth')
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

require('dotenv').config();
const pool = require('./db');
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // Allow preflight for all routes
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  bcrypt.hash('Password123', 10).then(console.log);

  res.send({ status: 'OK' });
});
app.use('/api/admin', authenticateToken, requireAdmin, adminRoutes);
app.use('/api/auth', authRoutes);

// app.get('/api/audios', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM audios');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('DB error');
//   }
// });



app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

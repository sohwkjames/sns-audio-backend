const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

require('dotenv').config();
const pool = require('./db');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

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

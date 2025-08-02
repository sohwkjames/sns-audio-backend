const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin} = require('./middleware/auth')
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const audioRoutes = require('./routes/audio');

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
app.use('/api/audios', audioRoutes);
app.use('/uploads', express.static('uploads')); // allow client to access the audio file


app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

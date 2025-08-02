const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');
const path = require('path');
const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('audio'), async (req, res) => {
  const { title, category, description } = req.body;
  const user_id = req.user.userId;
  const file_path = req.file?.path;

  if (!file_path || !title) {
    return res.status(400).json({ error: 'Title and audio file are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO audios (user_id, title, category, description, file_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING audio_id`,
      [user_id, title, category, description, file_path]
    );
    res.status(201).json({ audio_id: result.rows[0].audio_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save audio' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT audio_id, title, category, description, file_path, uploaded_at
       FROM audios
       WHERE user_id = $1
       ORDER BY uploaded_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch audios' });
  }
});

// Return a playback URL
router.get('/:id/play', authenticateToken, async (req, res) => {
  console.log('in the playback endpoint')
  const audioId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT file_path FROM audios WHERE audio_id = $1 AND user_id = $2`,
      [audioId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audio not found' });
    }

    const filePath = result.rows[0].file_path;
    const filename = path.basename(filePath);

    // Return direct playback URL
    res.json({
      url: `${process.env.BACKEND_BASE_URL || 'http://localhost:5000'}/uploads/${filename}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Playback failed' });
  }
});


module.exports = router;

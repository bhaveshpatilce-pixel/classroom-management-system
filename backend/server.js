'use strict';

const express  = require('express');
const path     = require('path');
const cors     = require('cors');
const helmet   = require('helmet');
const dotenv   = require('dotenv');

const connectDB = require('./config/db');

// ── Environment ────────────────────────────────────────────────────────────────
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ── App ────────────────────────────────────────────────────────────────────────
const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// ── Static Frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/courses',       require('./routes/courses'));
app.use('/api/assignments',   require('./routes/assignments'));
app.use('/api/submissions',   require('./routes/submissions'));
app.use('/api/announcements', require('./routes/announcements'));

// Keep-alive route for Render
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// ── SPA Fallback ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  } else {
    res.status(404).json({ message: 'API route not found.' });
  }
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`📡  API base:         http://localhost:${PORT}/api`);
    
    // ── Keep-Alive Ping ────────────────────────────────────────────────────────
    // Pings the server every 14 minutes to prevent Render from sleeping
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
      const https = require('https');
      setInterval(() => {
        https.get(`${RENDER_EXTERNAL_URL}/api/ping`, (resp) => {
          if (resp.statusCode === 200) {
            console.log('✅  Keep-alive ping successful');
          } else {
            console.error('❌  Keep-alive ping failed', resp.statusCode);
          }
        }).on('error', (err) => {
          console.error('❌  Keep-alive ping error:', err.message);
        });
      }, 14 * 60 * 1000); // 14 minutes
    }
  });
});

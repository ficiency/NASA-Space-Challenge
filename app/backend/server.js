const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend!' });
});

// Serve frontend build (if present). Check common output dirs: dist (vite) or build
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
let staticDir = null;
if (fs.existsSync(frontendDist)) staticDir = frontendDist;
else if (fs.existsSync(frontendBuild)) staticDir = frontendBuild;

if (staticDir) {
  console.log('Serving frontend from', staticDir);
  app.use(express.static(staticDir));

  // For client-side routing, serve index.html for unknown routes (except /api)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  console.log('Frontend build not found (dist/build) - API only mode');
}

const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => {
  const url = `http://${host}:${port}`;
  console.log(`Backend listening on ${url}`);

  // Auto-open browser on Windows unless OPEN_BROWSER is 'false'
  const openBrowser = (process.env.OPEN_BROWSER || 'true').toLowerCase();
  if (openBrowser !== 'false') {
    try {
      const { exec } = require('child_process');
      // 'start' is a cmd built-in; use 'cmd /c start' to open default browser on Windows
      if (process.platform === 'win32') {
        exec(`cmd /c start "" "${url}"`);
      } else if (process.platform === 'darwin') {
        exec(`open "${url}"`);
      } else {
        exec(`xdg-open "${url}"`);
      }
    } catch (e) {
      console.warn('Failed to auto-open browser:', e.message);
    }
  }
});

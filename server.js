const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

function serveFile(req, res, filePath, stat) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const range = req.headers.range;

  // Handle video Range requests (HTTP 206 Partial Content) for smooth seek/playback
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const totalSize = stat.size;
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

    if (start >= totalSize || end >= totalSize || start > end) {
      res.writeHead(416, {
        'Content-Range': `bytes */${totalSize}`,
        'Content-Type': contentType
      });
      return res.end();
    }

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    fileStream.pipe(res);
  } else {
    // Normal file stream (HTTP 200)
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    });

    fs.createReadStream(filePath).pipe(res);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  // Security: Prevent directory traversal
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stat) => {
    if (err) {
      // If not found, return 404 or index.html for SPA routes
      if (err.code === 'ENOENT') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.stat(indexPath, (indexErr, indexStat) => {
          if (!indexErr && indexStat.isFile()) {
            return serveFile(req, res, indexPath, indexStat);
          }
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
      return;
    }

    if (stat.isDirectory()) {
      const indexPath = path.join(safePath, 'index.html');
      fs.stat(indexPath, (indexErr, indexStat) => {
        if (!indexErr && indexStat.isFile()) {
          serveFile(req, res, indexPath, indexStat);
        } else {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 Forbidden');
        }
      });
    } else {
      serveFile(req, res, safePath, stat);
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`
============================================================
  COSMETRIC'26 // STARK INDUSTRIES MARK-XXVI INTERFACE
  Department of ECE, Sriram Engineering College
============================================================
  STATUS    : SYSTEMS NOMINAL // ONLINE
  LOCAL URL : http://localhost:${port}
============================================================
`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is currently in use. Switching to port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);

// server.js
import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import express from 'express';
import compression from 'compression';
import fs from 'fs';

// Detect environment
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
};

app.prepare().then(() => {
  const server = express();

  // Enable gzip compression
  server.use(compression());

  // Handle all requests with Next
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Start HTTPS server
  createServer(httpsOptions, server).listen(3000, '0.0.0.0', () => {
    console.log('✅ HTTPS Server running at https://0.0.0.0:3000');
  });
});

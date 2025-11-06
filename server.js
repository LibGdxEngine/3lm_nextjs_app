// server.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import express from 'express';
import compression from 'compression';

// Detect environment
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable gzip compression
  server.use(compression());

  // Handle all requests with Next
  server.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Start HTTP server (nginx handles SSL termination)
  createServer(server).listen(3000, '0.0.0.0', () => {
    console.log('✅ HTTP Server running at http://0.0.0.0:3000');
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

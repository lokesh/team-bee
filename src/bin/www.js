#!/usr/bin/env node
import debug from 'debug';
import http from 'http';
import app from '../app';

// Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Handle server errors
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      alert(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      alert(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Log port
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

// Listen on port
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

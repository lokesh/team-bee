#!/usr/bin/env node
import debug from 'debug';
import http from 'http';
import socketio from 'socket.io';
import app from '../app';

// Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = socketio(server);

io.on('connection', socket => {
  // socket.emit()           send to single client
  // socket.broadcast.emit() send to all but originator
  // io.emit()               send to all

  socket.emit('message', 'Welcome to chat!');

  socket.broadcast.emit('message', 'A user joined the chat');

  socket.on('message', (data) => {
    socket.broadcast.emit('message', `User ${data} has joined!`);
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  })

  socket.on('move', () => {
    io.emit('position', 'position');
  })
})


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

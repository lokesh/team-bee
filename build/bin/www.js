#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _debug = _interopRequireDefault(require("debug"));

var _http = _interopRequireDefault(require("http"));

var _app = _interopRequireDefault(require("../app"));

// Set Port
var port = process.env.PORT || '3000';

_app["default"].set('port', port); // Create HTTP server


var server = _http["default"].createServer(_app["default"]); // Handle server errors


var onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? "Pipe ".concat(port) : "Port ".concat(port); // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      alert("".concat(bind, " requires elevated privileges"));
      process.exit(1);
      break;

    case 'EADDRINUSE':
      alert("".concat(bind, " is already in use"));
      process.exit(1);
      break;

    default:
      throw error;
  }
}; // Log port


var onListening = function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? "pipe ".concat(addr) : "port ".concat(addr.port);
  (0, _debug["default"])("Listening on ".concat(bind));
}; // Listen on port


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
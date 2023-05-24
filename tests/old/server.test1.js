/*
const http = require('http');
const app = require('../app');
require('dotenv').config()

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind + ' => ' + 'http://localhost:' + port);
});

const io = require('socket.io')(server, {
  cors: {origin : '*'}
});
// initialize socket module and pass it the io instance
require('../socket')(io);

server.listen(port);

describe('normalizePort function', () => {
  it('should return a number if given a number string', () => {
    expect(normalizePort('3000')).toBe(3000);
  });
  
  it('should return a string if given a non-number string', () => {
    expect(normalizePort('hello')).toBe('hello');
  });

  it('should return false if given a negative number string', () => {
    expect(normalizePort('-1')).toBe(false);
  });

  it('should return false if given a zero string', () => {
    expect(normalizePort('0')).toBe(false);
  });
});

describe('errorHandler function', () => {
  it('should throw an error if error.syscall is not "listen"', () => {
    const error = { syscall: 'read' };
    expect(() => { errorHandler(error) }).toThrow();
  });

  it('should throw an error if error.code is "EACCES"', () => {
    const error = { syscall: 'listen', code: 'EACCES' };
    expect(() => { errorHandler(error) }).toThrow();
  });

  it('should throw an error if error.code is "EADDRINUSE"', () => {
    const error = { syscall: 'listen', code: 'EADDRINUSE' };
    expect(() => { errorHandler(error) }).toThrow();
  });
});
*/
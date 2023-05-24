//const http = require('http');
const request = require('supertest');
const server = require('../server');
const app = require('../app');

describe('server', () => {
  it('should listen on the specified port', done => {
    // const port = server.address().port;
    request(app).get('/').end((err, res) => {
      if (err) return done(err);
      expect(res.status).toEqual(200);
      done();
    });
  });

  afterAll(() => {
    server.close();
  });
  
});

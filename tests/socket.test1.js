const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const myRealServerSocketToTest = require('../socket');
const path = require('path');


describe("test my socket", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client('http://localhost:3000');
      myRealServerSocketToTest(io);
      // io.on("connection", (socket) => {
      //   console.log('connection');
      //   serverSocket = socket;
      // });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('addOrUpdatePlayer', (done) => {
    // once connected, emit Hello World
    const player = {
      id : clientSocket.id,
      pseudo : 'test',
      avatar : 'test',
      roomId : '',
      start : false
    }
    const players = require(path.join('../datas/players.json'));
    console.log(players);
    clientSocket.emit('addOrUpdatePlayer', player);
    // Check that the message matches
    setTimeout(() => {
      // Put your server side expect() here
      console.log(players);
      expect(players).toHaveLength(1);
      done();
    }, 4000);
  });
});
//const server = require('../server');
const path = require('path');
//const players = require('../socket').players;

//let players = require(path.join('../datas/players.json'));

// Mock data
const player = { id: 1, name: 'John' };
//const io = require('../socket')(io);
const socket = require("socket.io-client");

//const players = [{ id: 2, name: 'Alice' }];


describe('addOrUpdatePlayer', () => {  
    /*
    beforeEach(() => {
      // Reset the players data before each test
      players.splice(0, players.length);
    });
    */
  it('should add a new player to the players array', () => {
    socket.emit('addOrUpdatePlayer', player);
    //const players = require(path.join('../datas/players.json'));
    const players = server.players;
    players = JSON.parse(players);
    //const players = server.players;
    console.log(players);
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(player);
  });

  it('should update an existing player in the players array', () => {
    //players.push(player);
    const updatedPlayer = { id: 1, name: 'Updated John' };
    socket.emit('addOrUpdatePlayer', updatedPlayer);
    //const players = require(path.join('../datas/players.json'));
    //const players = server.players;
    const players = server.players;
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(updatedPlayer);
  });

  afterAll(() => {
    server.close();
  });

});

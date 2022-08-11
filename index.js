const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
const path = require('path');
const url = require('url');

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static('public'));

//ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});
app.all('/connection/?', (req, res, next) => {
  const query = url.parse(req.url,true).query;
  const game = games[query.game];
  if(game) {
    next();
  } else {
    res.sendFile(path.join(__dirname, 'views/404.html'));
    // next(new Error('cannot find game ' + req.params.id));
  }
});
app.get('/connection/?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/connection.html'));
});
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'views/404.html'));
});

http.listen(port, () =>
    console.log(`listening on port : http://localhost:${port}`)
);

// DATABASE :
const games = require(path.join(__dirname + '/public/datas/games.json'));
const players = require(path.join(__dirname + '/public/datas/players.json'));
const rooms = require(path.join(__dirname + '/public/datas/rooms.json'));
const robotConversation = require(path.join(__dirname + '/public/datas/robotConversation.json'));

io.on('connection', (socket) => {
    console.log(`a user connected whith id : ${socket.id}`);
    const chronoRoom = 5;
    //CONNECTION
    // add new player or update existed player into players
    socket.on('addOrUpdatePlayer', (player) => {
      const playerIndex = getPlayerIndex(players, player.id)
      if(!players[playerIndex]) players.push(player);
      else players[playerIndex] = player;
    });
    // create new room or get existed room waiting for new players
    socket.on('createOrJoinRoom', (gameIndex) => {
      const gameInfo = {
        name : games[gameIndex].name,
        chronoStart: games[gameIndex].chronoStart,
        chrono : games[gameIndex].chrono,
        clues : JSON.parse(JSON.stringify(games[gameIndex].clues)),
        deck : JSON.parse(JSON.stringify(games[gameIndex].deck)),
        code: games[gameIndex].code,
        ended: games[gameIndex].ended
      }
      // Object.assign({}, games[gameIndex]);
      let room = rooms.filter(room => room.chrono > 0 && !room.startGame && getTeam(players, room.id).length < 4 && room.game.name === gameInfo.name)[0];
      let roomId = room ? room.id : null;
      let firstPlayer = false;
      if(!roomId) {
        roomId = newId();
        firstPlayer = true;
        createRoom(roomId, chronoRoom, gameInfo, robotConversation, rooms);
        const roomIndex = getRoomIndex(rooms, roomId);
        room = rooms[roomIndex];
      }
      const indexPlayer = getPlayerIndex(players, socket.id);
      players[indexPlayer].roomId = roomId;
      const team = getTeam(players, roomId);
      socket.emit('setRoom', room);
      io.emit('getTeam', team);
      intervalChrono(socket, rooms, players, roomId, firstPlayer)
    });

    socket.on('back', (roomId) => {
      let team = getTeam(players, roomId);
      if(team[1]) {
        refreshPlayer(socket, players);
        team = getTeam(players, roomId);
        io.emit('getTeam', team);
        teamReady(team, rooms, roomId);
      } else {
        const indexRoom = rooms.findIndex(room => room.id === roomId);
        back(socket, players, rooms, indexRoom);
      }
    });
    socket.on('start', (roomId) => {
      const playerIndex = getPlayerIndex(players, socket.id);
      players[playerIndex].start = true;
      const team = getTeam(players, roomId);
      io.emit('getTeam', team);
      teamReady(team, rooms, roomId);
    });

    //ROOM
    socket.on('addClue', (clueNum, roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      const clueIndex = getClueIndex(rooms[roomIndex].game.deck, clueNum);
      if(clueIndex !== -1) {
        rooms[roomIndex].game.deck[clueIndex].discard.forEach(num => {
          const clueToDefausseIndex = getClueIndex(rooms[roomIndex].game.clues, num);
          if(clueToDefausseIndex !== -1) rooms[roomIndex].game.clues.splice(clueToDefausseIndex, 1);
        })
        rooms[roomIndex].game.clues.push(rooms[roomIndex].game.deck[clueIndex]);
        rooms[roomIndex].game.deck.splice(clueIndex, 1);
        const team = getTeam(players, roomId);
        io.emit('updateClues', rooms[roomIndex].game, team);
      }
    });
    socket.on('penalty', (time, roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      if (rooms[roomIndex].game.chrono - time < 0) {
        rooms[roomIndex].game.chrono = 0;
      } else {
        rooms[roomIndex].game.chrono-=time;
      }
      // todo robot said something
      if(rooms[roomIndex].game.chrono <= 0) {
        const team = getTeam(players, roomId);
        io.emit('updateRoomChrono', rooms[roomIndex].game.chrono, team);
      }
    });
    socket.on('winGame', (roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      rooms[roomIndex].game.ended = true;
      const team = getTeam(players, roomId);
      io.emit('getRoom', rooms[roomIndex], team);
    });
    socket.on('message', (note, roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      rooms[roomIndex].notes.push(note);
      const team = getTeam(players, roomId);
      io.emit('getRoom', rooms[roomIndex], team);
      talkToRobot(note, rooms, roomId, players, robotConversation);
    });

    socket.on('disconnect', () => {
      const playerIndex = getPlayerIndex(players, socket.id);
      if(players[playerIndex]) {
        const roomId = players[playerIndex].roomId;
        removePlayer(players, playerIndex, rooms);
        const team = getTeam(players, roomId);
        const roomIndex = getRoomIndex(rooms, roomId);
        if(team[0] && rooms[roomIndex] && !rooms[roomIndex].startGame) {
          io.emit('getTeam', team);
          teamReady(team, rooms, roomId);
        }
      }
      console.log(`a user discconnected whith id : ${socket.id}`);
    });

});

// FOR THE CONNECTION TEMPLATE
// return player's index from players
function getPlayerIndex(players, id) {
  const index = players.findIndex(player => player.id === id);
  return index;
}
// return room's index from rooms
function getRoomIndex(rooms, id) {
  const index = rooms.findIndex(room => room.id === id);
  return index;
}
// return player's array with same room's id
function getTeam(players, id) {
  const team = players.filter(player => player.roomId === id);
  return team;
}
// return id
function newId() {
  return Math.random().toString(36).substring(2, 9);
}
// create room into rooms
function createRoom(roomId, chronoRoom, gameInfo, robotConversation, rooms) {
  const room = {
    id: roomId,
    chrono: chronoRoom,
    game: gameInfo,
    startGame: false,
    notes: [
      {
        message: robotConversation["A"],
        avatar: 'robot.svg',
        date: new Date().getTime()
      },
      {
        message: robotConversation["B"],
        avatar: 'robot.svg',
        date: new Date().getTime()+1
      },
      {
        message: robotConversation["C"],
        avatar: 'robot.svg',
        date: new Date().getTime()+2
      }
    ]
  }
  rooms.push(room);
}
// refresh chrono each seconde from room and go to back function if only one player at the end of chrono
function intervalChrono(socket, rooms, players, roomId, firstPlayer) {
  const idInterval = setInterval(() => {
    const roomIndex = getRoomIndex(rooms, roomId);
    if (rooms[roomIndex] && rooms[roomIndex].chrono >= 0) {
      if(firstPlayer) rooms[roomIndex].chrono--;
      const chrono = rooms[roomIndex].chrono > 0 ? rooms[roomIndex].chrono : 0;
      socket.emit('getChronoRoom', chrono);
      const team = getTeam(players, roomId);
      if(chrono === 0 && !team[1] && socket.id === team[0].id) {
        back(socket, players, rooms, roomIndex);
      };
    } else clearInterval(idInterval);
  }, 1000);
}
// go to refreshPlayer and removeRoom functions
function back(socket, players, rooms, roomIndex) {
  refreshPlayer(socket, players);
  removeRoom(rooms, roomIndex);
}
// set roomId param to '' and start param to false then emit team's array to empty array for the current player
function refreshPlayer(socket, players) {
  const index = getPlayerIndex(players, socket.id);
  players[index].roomId = '';
  players[index].start = false;
  socket.emit('refreshData', [], players[index]);
}
// remove the room at the index param
function removeRoom(rooms, index) {
  rooms.splice(index, 1);
}
// remove the player at the index param and if it was the last player from the room remove the room
function removePlayer(players, index, rooms) {
  const roomId = players[index].roomId;
  players.splice(index, 1);
  const team = getTeam(players, roomId);
  if(!team[0]) {
    const roomIndex = getRoomIndex(rooms, roomId);
    removeRoom(rooms, roomIndex);
  }
}
// if > 2 players into team and each player is ready so set startGame param for current room to true and emit new room before go to intervalRoom function
function teamReady(team, rooms, roomId) {
  if(team[1] && team.length === team.filter(player => player.start).length) {
    const roomIndex = getRoomIndex(rooms, roomId);
    rooms[roomIndex].startGame = true;
    io.emit('getRoom', rooms[roomIndex], team);
    intervalRoom(rooms, roomId, team);
  }
}

// FOR THE ROOM TEMPLATE
// refresh chrono each seconde from room.game and emit this
function intervalRoom(rooms, roomId, team) {
  const idIntervalChrono = setInterval(() => {
    const roomIndex = getRoomIndex(rooms, roomId);
    if (rooms[roomIndex] && rooms[roomIndex].game.chrono > 0 && rooms[roomIndex].game.ended !== true) {
      rooms[roomIndex].game.chrono--;
      io.emit('updateRoomChrono', rooms[roomIndex].game.chrono, team);
    } else clearInterval(idIntervalChrono);
  }, 1000);
}

function getClueIndex(clues, id) {
  const index = clues.findIndex(clue => clue.id === id);
  return index;
}
function talkToRobot(note, rooms, roomId, players, robotConversation) {
  let roomIndex = getRoomIndex(rooms, roomId);
  const str = note.message.toLowerCase();
  let regexp = /indice/;
  if(str.match(regexp)) {
    regexp = /[0-9]{1,}/g;
    const messages = [];
    const match = str.match(regexp) ? str.match(regexp) : [];
    match.forEach(num => {
      const message = robotConversation[num] && rooms[roomIndex].game.clues.filter(clue => clue.id == num)[0] ? robotConversation[num] : robotConversation["D"]+num;
      if(!messages.includes(message)) messages.push(message);
    });
    const idInterval = setInterval(() => {
      if (messages[0]) {
        const note = {
          message: messages[0],
          avatar: 'robot.svg',
          date: new Date().getTime()
        };
        roomIndex = getRoomIndex(rooms, roomId);
        rooms[roomIndex].notes.push(note);
        const team = getTeam(players, roomId);
        io.emit('getRoom', rooms[roomIndex], team);
        messages.splice(0, 1);
      } else clearInterval(idInterval);
    }, 1000);
  }
}
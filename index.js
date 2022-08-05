const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
const path = require('path');

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static('public'));

//ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});
app.all('/connection/:id', (req, res, next) => {
  req.game = require(path.join(__dirname + '/public/datas/games.json'))[req.params.id];
  if(req.game) {
    next();
  } else {
    next(new Error('cannot find game ' + req.params.id));
  }
});
app.get('/connection/:id', (req, res) => {
  this.game = req.game;
  res.sendFile(path.join(__dirname, 'views/connection.html'));
});
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'views/404.html'));
});

http.listen(port, () =>
    console.log(`listening on port : http://localhost:${port}`)
);
// DATA
let gameInfo = {};

// DATABASE :
const players = require(path.join(__dirname + '/public/datas/players.json'));
const rooms = require(path.join(__dirname + '/public/datas/rooms.json'));
const robotConversation = require(path.join(__dirname + '/public/datas/robotConversation.json'));

io.on('connection', (socket) => {
    console.log(`a user connected whith id : ${socket.id}`);
    const chronoRoom = 20;
    //CONNECTION
    addPlayer(socket, players);
    socket.on('changePlayerAndGetRoom', (pseudo, avatar) => {
      const index = getPlayerIndex(players, socket.id);
      players[index].pseudo = pseudo;
      players[index].avatar = avatar;
      createOrGetRoom(socket, rooms, players, chronoRoom, gameInfo, robotConversation);
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
    socket.on('penalty', (time, roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      if (rooms[roomIndex].game.chrono - time < 0) {
        rooms[roomIndex].game.chrono = 0;
      } else {
        rooms[roomIndex].game.chrono-=time;
      }
      if(rooms[roomIndex].game.chrono <= 0) {
        const team = getTeam(players, roomId);
        io.emit('updateRoomChrono', rooms[roomIndex].game.chrono, team);
      }
    });
    socket.on('addClue', (clueNum, roomId) => {
      const roomIndex = getRoomIndex(rooms, roomId);
      const clueIndex = getClueIndex(rooms[roomIndex].game.deck, clueNum);
      if(clueIndex !== -1) {
        rooms[roomIndex].game.deck[clueIndex].defausse.forEach(num => {
          const clueToDefausseIndex = getClueIndex(rooms[roomIndex].game.clues, num);
          if(clueToDefausseIndex !== -1) rooms[roomIndex].game.clues.splice(clueToDefausseIndex, 1);
        })
        rooms[roomIndex].game.clues.push(rooms[roomIndex].game.deck[clueIndex]);
        rooms[roomIndex].game.deck.splice(clueIndex, 1);
        const team = getTeam(players, roomId);
        io.emit('getRoom', rooms[roomIndex], team);
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
      const index = getPlayerIndex(players, socket.id);
      const roomId = players[index].roomId;
      removePlayer(players, index);
      const team = getTeam(players, roomId);
      if(team[0]) {
        io.emit('getTeam', team);
        teamReady(team, rooms, roomId);
      }
      console.log(`a user discconnected whith id : ${socket.id}`);
    });

});

// CONNECTION
function getPlayerIndex(players, id) {
  const index = players.findIndex(player => player.id === id);
  return index;
}
function getRoomIndex(rooms, id) {
  const index = rooms.findIndex(room => room.id === id);
  return index;
}
function getTeam(players, id) {
  const team = players.filter(player => player.roomId === id);
  return team;
}
function addPlayer(socket, players) {
  const player = {
      id: socket.id,
      pseudo: '',
      avatar: '',
      roomId: '',
      start: false
  }
  const index = getPlayerIndex(players, player.id)
  if(!players[index]) players.push(player);
  socket.emit('getPlayerId', player.id);
}
function refreshPlayer(socket, players) {
  const index = getPlayerIndex(players, socket.id);
  players[index].roomId = '';
  players[index].start = false;
  socket.emit('refreshTeam', []);
}
function removePlayer(players, index) {
  players.splice(index, 1);
}
function createOrGetRoom(socket, rooms, players, chronoRoom, gameInfo, robotConversation) {
  const room = rooms.filter(room => room.chrono > 0 && getTeam(players, room.id).length < 4 && !room.startGame)[0];
  let roomId = room ? room.id : null;
  let minusChrono = false;
  if(!roomId) {
    minusChrono = true;
    roomId = newId();
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
  const indexPlayer = getPlayerIndex(players, socket.id);
  players[indexPlayer].roomId = roomId;
  const roomIndex = getRoomIndex(rooms, roomId);
  const team = getTeam(players, roomId);
  socket.emit('getRoom', rooms[roomIndex], team);
  io.emit('getTeam', team);
  intervalChrono(socket, rooms, players, roomId, minusChrono)
}
function intervalChrono(socket, rooms, players, roomId, minusChrono) {
  const idInterval = setInterval(() => {
    const roomIndex = getRoomIndex(rooms, roomId);
    if (rooms[roomIndex].chrono >= 0) {
      if(minusChrono) rooms[roomIndex].chrono--;
      const chrono = rooms[roomIndex].chrono > 0 ? rooms[roomIndex].chrono : 0;
      socket.emit('getChronoRoom', chrono);
      const team = getTeam(players, roomId);
      if(chrono === 0 && !team[1] && socket.id === team[0].id) {
        back(socket, players, rooms, roomIndex);
      };
    } else clearInterval(idInterval);
  }, 1000);
}
function back(socket, players, rooms, index) {
  refreshPlayer(socket, players);
  removeRoom(rooms, index);
}
function removeRoom(rooms, index) {
  rooms.splice(index, 1);
}
function teamReady(team, rooms, roomId) {
  if(team[1] && team.length === team.filter(player => player.start).length) {
    const roomIndex = getRoomIndex(rooms, roomId);
    rooms[roomIndex].startGame = true;
    io.emit('getRoom', rooms[roomIndex], team);
    intervalRoom(rooms, roomId, team);
  }
}
function newId() {
  return Math.random().toString(36).substring(2, 9);
}

//ROOM
function intervalRoom(rooms, roomId, team) {
  const idIntervalChrono = setInterval(() => {
    const roomIndex = getRoomIndex(rooms, roomId);
    if (rooms[roomIndex].game.chrono > 0 && rooms[roomIndex].game.ended !== true) {
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
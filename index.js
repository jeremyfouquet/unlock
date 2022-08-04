const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {origin : '*'}
});
const port = process.env.PORT || 3000;

http.listen(port, () =>
    console.log(`listening on port : ${port}`)
);
// DATABASE :
const path = require('path');
const players = require(path.join(__dirname + '/templates/players.json'));
const rooms = require(path.join(__dirname + '/templates/rooms.json'));
const robotConversation = require(path.join(__dirname + '/templates/robotConversation.json'));

io.on('connection', (socket) => {
    console.log(`a user connected whith id : ${socket.id}`);
    const games = {
      "name" : "Tutorial",
      "chronoStart": false,
      "chrono" : 600,
      "clues" : [
          {
              "id": 0,
              "name": "Bureau",
              "description": "Voici la pièce où vous êtes enfermés. Plusieurs éléments sont visibles. Vous pouvez maintenant révéler les cinq indices dont vous voyer le numéro. Pour cela entrez chaque numéro que vous voyez dans le champ \"Recherche d'indice\".",
              "img": "bureau.png",
              "numsClues": [11, 42, 35, 69, 21],
              "defausse": [],
              "type": "lieu"
          }
      ],
      "deck": [
          {
              "id": 11,
              "name": "Une Clé",
              "description": "Vous pouvez combiner cet objet avec un objet rouge. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
              "img": "cle.png",
              "numsClues": [],
              "defausse": [],
              "type": "combinable",
              "combinable": {
                "numClue": 11,
                "numCombine": 46,
                "couleur": "blue"
              }
          },
          {
              "id": 16,
              "name": "Un fil",
              "description": "Un fil éléctrique de 10 cm avec des embouts en forme d'anneaux. Vous pouvez combiner cet objet avec un objet rouge. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
              "img": "fil.png",
              "numsClues": [],
              "defausse": [],
              "type": "combinable",
              "combinable": {
                "numClue": 16,
                "numCombine": 25,
                "couleur": "blue"
              }
          },
          {
              "id": 21,
              "name": "La Porte de sortie",
              "description": "Elle est commandée par un digicode. Pour sortir et terminer le tutoriel, vous devez entrer un code à 4 chiffres à l'aide du digicode ci-dessous. Cherchez dans la pièce.",
              "img": "porte.png",
              "defausse": [],
              "numsClues": [],
              "type": "code"
          },
          {
              "id": 25,
              "name": "Courant éléctrique",
              "description": "Bravo. Vous avez rétabli le courant en plaçant le fil sur la machine. Vous pouvez combiner cet objet avec un objet rouge. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
              "img": "courant.png",
              "numsClues": [],
              "defausse": [16, 46, 85],
              "type": "combinable",
              "combinable": {
              "numClue": 25,
              "numCombine": 67,
              "couleur": "blue"
              }
          },
          {
              "id": 35,
              "name": "Un coffre",
              "description": "Il est fermé à clé. Vous pouvez combiner cet objet avec un objet bleu. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
              "img": "coffre.png",
              "numsClues": [],
              "defausse": [],
              "type": "combinable",
              "combinable": {
                "numClue": 35,
                "numCombine": 46,
                "couleur": "red"
              }
          },
          {
              "id": 42,
              "name": "Un écran",
              "description": "Il n'y a pas de courant. Vous pouvez combiner cet objet avec un objet bleu. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
              "img": "ecran.png",
              "defausse": [],
              "numsClues": [],
              "type": "combinable",
              "combinable": {
                "numClue": 42,
                "numCombine": 67,
                "couleur": "red"
              }
          },
          {
              "id": 46,
              "name": "Un coffre",
              "description": "Trés bien. Le coffre est ouvert. Regardez bien l'image. Il y a DEUX éléments intéréssants. Si vous voyez un numéro, utilisez le champ \"Recherche d'indice\" pour révéler l'indice.",
              "img": "coffre2.png",
              "numsClues": [16],
              "defausse": [11, 35],
              "type": "simple"
          },
          {
              "id": 67,
              "name": "Un écran",
              "description": "Bien joué. L'écran est allumé. Cela doit servir pour sortir. Vous pouvez entrer un code dans le champ \"Code\" grâce à ces 4 chiffres.",
              "img": "ecran2.png",
              "numsClues": [],
              "defausse": [25, 42],
              "type": "simple"
          },
          {
            "id": 69,
            "name": "Une grille",
            "description": "Une grille avec des picos séparés de 5 cm. Vous pouvez combiner cet objet avec un objet bleu. Pour cela entrez dans le champ \"Combiner\" de la carte le numéro de l'objet avec lequel vous souhaitez le combiner. Mais attention, si ce n'est pas le bon objet vous aurez une pénalité!",
            "img": "grille.png",
            "defausse": [],
            "numsClues": [],
            "type": "combinable",
            "combinable": {
              "numClue": 69,
              "numCombine": 85,
              "couleur": "red"
            },
          },
          {
              "id": 85,
              "name": "Une Machine",
              "description": "Il s'agissait d'une Machine. En cliquant sur le bouton \"Utiliser\" vous pourrez choisir comment placer le fil sur les picots. Regardez bien dans toute la pièce il doit y avoir des indices sur son fonctionnement.",
              "img": "grille.png",
              "defausse": [69],
              "numsClues": [],
              "type": "machine",
              "machine": {
                "reponse": "choix3.png",
                "replaceClue": 25,
                "choix": ["choix1.png", "choix2.png", "choix3.png"],
                "active": true
              }
          }
      ],
      "code": 9372,
      "ended": false
    };
    const chronoRoom = 20;
    //CONNECTION
    addPlayer(socket, players);
    socket.on('changePlayerAndGetRoom', (pseudo, avatar) => {
      const index = getPlayerIndex(players, socket.id);
      players[index].pseudo = pseudo;
      players[index].avatar = avatar;
      createOrGetRoom(socket, rooms, players, chronoRoom, games, robotConversation);
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
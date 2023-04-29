const path = require('path');
const games = require(path.join(process.cwd(), '/datas/games.json'));
const url = require('url');
const {server} = require('../server')
const io = require('socket.io')(server, {
    cors: {origin : '*'}});


exports.getHome = (req, res) => {
        res.status(200).sendFile(path.join(process.cwd(), '/views/home.html'));
};

exports.getBuildPage = (req, res, next) => {
    const query = url.parse(req.url,true).query;
    const game = games[query.game];
    if(game) {
      next();
    } else {
      res.sendFile(path.join(process.cwd(), '/views/buildingpage.html'));
    }
}

exports.getPlaygroundPage = (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/playground.html'));

// SOCKET :
io.on('connection', (socket) => {
  const chronoRoom = 20; // chrono par defaut pour la Room
  /**
   * Permet d'ajouter ou de mettre à jour un Player en BDD
   * @name addOrUpdatePlayer
   * @param { Object } player
  */
  socket.on('addOrUpdatePlayer', (player) => {
    const playerIndex = getPlayerIndex(players, player.id)
    // Si player.id existe en BDD alors met à jours le Player de la BDD avec les info reçu en parametre de la fonction sinon ajoute celui ci en BDD
    if(!players[playerIndex]) players.push(player);
    else players[playerIndex] = player;
  });

  /**
   * Permet de créer une Room si nécéssaire en BDD, de lier un Player à une Room et de démarer le chronometre de la Room
   * @name createOrJoinRoom
   * @param { number } gameIndex
  */
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
    let room = rooms.filter(room => room.chrono > 0 && !room.startGame && getTeam(players, room.id).length < 4 && room.game.name === gameInfo.name)[0];
    let roomId = room ? room.id : null;
    let firstPlayer = false;
    // Si aucune Room en attente de joueur en BDD alors la créer avec les infos correspondant au game du gameIndex passé en parametre
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
    // Mettre à jour en BDD le roomId du currentPlayer avec la Room créé ou en attente de joueurs
    socket.emit('setRoom', room);
    // Envoyé au client les infos mises à jours de la Room et de la Team puis appel de la fonction intervalChrono()
    io.emit('getTeam', team);
    intervalChrono(socket, rooms, players, roomId, firstPlayer)
  });

  /**
   * Permet de retirer le lien entre un Player et une Room
   * @name back
   * @param { string } roomId
  */
  socket.on('back', (roomId) => {
    let team = getTeam(players, roomId);
    // S'il reste plus d'un Player avec la roomId passé en parametre alors appelle de la fonction refreshPlayer(), envoi au client la Team mise à jour et appelle de la fonction teamReady()
    if(team[1]) {
      refreshPlayer(socket, players);
      team = getTeam(players, roomId);
      io.emit('getTeam', team);
      teamReady(team, rooms, roomId);
    // Sinon appelle de la fonction back()
    } else {
      const indexRoom = rooms.findIndex(room => room.id === roomId);
      back(socket, players, rooms, indexRoom);
    }
  });

  /**
   * Permet de définir un Player comme étant pret à jouer
   * @name start
   * @param { string } roomId
  */
  socket.on('start', (roomId) => {
    const playerIndex = getPlayerIndex(players, socket.id);
    // Met à jour le parametre start du currentPlayer en BDD, envoi au client la mise à jour de la Team puis appelle de la fonction teamReady()
    players[playerIndex].start = true;
    const team = getTeam(players, roomId);
    io.emit('getTeam', team);
    teamReady(team, rooms, roomId);
  });

  /**
   * Permet de transferer un Clue du Deck vers les Clues
   * @name addClue
   * @param { number } clueNum
   * @param { string } roomId
  */
  socket.on('addClue', (clueNum, roomId) => {
    const roomIndex = getRoomIndex(rooms, roomId);
    const clueIndex = getClueIndex(rooms[roomIndex].game.deck, clueNum);
    // Si le Clue ayant le clueNum passé en parametre est présent dans le deck
    if(clueIndex !== -1) {
      // Mise à Jour des Clue en BDD à la fois dans les Clues et dans le Deck
      rooms[roomIndex].game.deck[clueIndex].discard.forEach(num => {
        const clueToDefausseIndex = getClueIndex(rooms[roomIndex].game.clues, num);
        if(clueToDefausseIndex !== -1) rooms[roomIndex].game.clues.splice(clueToDefausseIndex, 1);
      })
      rooms[roomIndex].game.clues.push(rooms[roomIndex].game.deck[clueIndex]);
      rooms[roomIndex].game.deck.splice(clueIndex, 1);
      const team = getTeam(players, roomId);
      // Envoi au client la mise à jour du Game
      io.emit('updateClues', rooms[roomIndex].game, team);
    }
  });

  /**
   * Permet de retirer du temps au chrono du Game en BDD et d'envoyer un message d'erreur au client
   * @name penalty
   * @param { number } time
   * @param { string } roomId
  */
  socket.on('penalty', (time, roomId) => {
    const roomIndex = getRoomIndex(rooms, roomId);
    // Si le time passé en parametre moins le chrono du Game correspondant à la roomId passé en parametre est inferieur à 0 alors le chrono est mis à jour à 0
    if (rooms[roomIndex].game.chrono - time < 0) {
      rooms[roomIndex].game.chrono = 0;
    // Sinon le chrono est mis à jour avec la valeur correspondante
    } else {
      rooms[roomIndex].game.chrono-=time;
    }
    const team = getTeam(players, roomId);
    const note = createNote(robotConversation["E"], 'robot.svg', 'robot0', 'game master');
    // envoi au client la note de l'IA
    io.emit('updateMessages', note, team);
    // Si le chrono est tombé à 0 alors envoi au client le chrono du Game
    if(rooms[roomIndex].game.chrono <= 0) {
      io.emit('updateRoomChrono', rooms[roomIndex].game.chrono, team);
    }
  });

  /**
   * Permet de signaler le Game comme étant terminé
   * @name winGame
   * @param { string } roomId
  */
  socket.on('winGame', (roomId) => {
    const roomIndex = getRoomIndex(rooms, roomId);
    rooms[roomIndex].game.ended = true;
    const team = getTeam(players, roomId);
    // Envoi au client la mise à jour du Game
    io.emit('updateRoomEnded', rooms[roomIndex].game.ended, team);
  });

  /**
   * Permet d'ajouter une Note dans le Game et de faire répondre l'IA si nécéssaire
   * @name message
   * @param { string } roomId
   * @param { Object } roomId
   * @param { string } roomId
  */
  socket.on('message', (message, player, roomId) => {
    const roomIndex = getRoomIndex(rooms, roomId);
    const note = createNote(message, player.avatar, player.id, player.pseudo);
    rooms[roomIndex].notes.push(note);
    const team = getTeam(players, roomId);
    // Envoi la note au client
    io.emit('updateMessages', note, team);
    // Appelle la fonction talkToRobot()
    talkToRobot(note, rooms, roomId, players, robotConversation);
  });

  /**
   * Permet de deconnecter un Player
   * @name disconnect
  */
  socket.on('disconnect', () => {
    const playerIndex = getPlayerIndex(players, socket.id);
    // Si le Player qui se deconnect existe en BDD
    if(players[playerIndex]) {
      const roomId = players[playerIndex].roomId;
      // Appelle de la fonction removePlayer()
      removePlayer(players, playerIndex, rooms);
      const team = getTeam(players, roomId);
      const roomIndex = getRoomIndex(rooms, roomId);
      // S'il reste des Players ayant la même Room que le Player venant de se deconnecté et que le jeu n'était pas encore commencé
      if(team[0] && rooms[roomIndex] && !rooms[roomIndex].startGame) {
        // envoi au client la mise à jour de la Team et appelle de la foncyion teamReady
        io.emit('getTeam', team);
        teamReady(team, rooms, roomId);
      }
    }
  });
});
};
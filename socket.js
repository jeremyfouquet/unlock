/****************************************************************************
  Nom ......... : server.js
  Rôle ........ : Fichier responsable de la gestion des communications en temps réel avec les clients via des WebSockets, définition des événements de socket et des actions correspondantes.
  Auteurs ..... : Jeremy Fouquet
  Version ..... : V1.0 du 28/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const path = require('path');

// DATABASE :
const games = require(path.join(__dirname + '/datas/games.json'));
const players = require(path.join(__dirname + '/datas/players.json'));
const rooms = require(path.join(__dirname + '/datas/rooms.json'));
const robotConversation = require(path.join(__dirname + '/datas/robotConversation.json'));

module.exports = (io) => {
  // SOCKET :
  io.on('connection', (socket) => {
    const chronoRoom = 20; // chrono par defaut pour la Room
    /**
     * Permet d'ajouter ou de mettre à jour un Player en BDD
     * @name addOrUpdatePlayer
     * @param { Object } player
    */
    socket.on('addOrUpdatePlayer', (player) => {
      const playerIndex = getPlayerIndex(players, player.id);
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

    
  /**
   * Permet de retourner l'index d'un Player dans un Array de Player en fonction de son id
   * @name getPlayerIndex
   * @param { Array<Object> } players
   * @param { string } id
   * @return { number }
  */
  function getPlayerIndex(players, id) {
    const index = players.findIndex(player => player.id === id);
    return index;
  }

  /**
   * Permet de retourner l'index d'une Room dans un Array de Room en fonction de son id
   * @name getRoomIndex
   * @param { Array<Object> } players
   * @param { string } id
   * @return { number }
  */
  function getRoomIndex(rooms, id) {
    const index = rooms.findIndex(room => room.id === id);
    return index;
  }

  /**
   * Permet de retourner un Array de Player filtrer avec les Players ayant une roomId spécifique
   * @name getTeam
   * @param { Array<Object> } players
   * @param { string } id
   * @return { Array<Object> }
  */
  function getTeam(players, id) {
    const team = players.filter(player => player.roomId === id);
    return team;
  }

  /**
   * Permet de retourner un id
   * @name newId
   * @return { string }
  */
  function newId() {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Permet de creer une Room et de l'ajouter dans un Array de Room
   * @name createRoom
   * @param { string } roomId
   * @param { number } chronoRoom
   * @param { Object } gameInfo
   * @param { JSON } robotConversation
   * @param { Array<Object> } rooms
  */
  function createRoom(roomId, chronoRoom, gameInfo, robotConversation, rooms) {
    const room = {
      id: roomId,
      chrono: chronoRoom,
      game: gameInfo,
      startGame: false,
      notes: [
        createNote(robotConversation["A"], 'robot.svg', 'robot0', 'game master'),
        createNote(robotConversation["B"], 'robot.svg', 'robot0', 'game master'),
        createNote(robotConversation["C"], 'robot.svg', 'robot0', 'game master')
      ]
    }
    rooms.push(room);
  }
  
  /**
   * Permet d'envoyer au Client le chrono mis à jour toutes les secondes tant que celui ci n'est pas inférieur à 0
   * Appelle la fonction back() si le chrono === 0 et Team.length === 1
   * @name intervalChrono
   * @param { any } socket
   * @param { Array<Object> } rooms
   * @param { Array<Object> } players
   * @param { string } roomId
   * @param { boolean } firstPlayer
  */
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

  /**
   * Permet d'appeler les fonction refreshPlayer() et removeRoom()
   * @name back
   * @param { any } socket
   * @param { Array<Object> } players
   * @param { Array<Object> } rooms
   * @param { number } roomIndex
  */
  function back(socket, players, rooms, roomIndex) {
    refreshPlayer(socket, players);
    removeRoom(rooms, roomIndex);
  }

  /**
   * Permet d'affecter roomId et start avec leurs valeurs par defaut au Player à un index specifique dans un Array de Players
   * Envoi un tableau vide en guise de Team au client
   * @name refreshPlayer
   * @param { any } socket
   * @param { Array<Object> } players
  */
  function refreshPlayer(socket, players) {
    const index = getPlayerIndex(players, socket.id);
    players[index].roomId = '';
    players[index].start = false;
    socket.emit('refreshData', []);
  }

  /**
   * Permet de supprimer la Room à un index spécifique dans un Array de Room
   * @name removeRoom
   * @param { Array<Object> } rooms
   * @param { number } index
  */
  function removeRoom(rooms, index) {
    rooms.splice(index, 1);
  }

  /**
   * Permet de supprimer le Player à un index spécifique dans un Array de Player
   * S'l n'y a plus d'autre Player avec la même roomId que le Player venant d'être supprimer alors appelle removeRoom()
   * @name removePlayer
   * @param { Array<Object> } players
   * @param { number } index
   * @param { Array<Object> } rooms
  */
  function removePlayer(players, index, rooms) {
    const roomId = players[index].roomId;
    players.splice(index, 1);
    const team = getTeam(players, roomId);
    if(!team[0]) {
      const roomIndex = getRoomIndex(rooms, roomId);
      removeRoom(rooms, roomIndex);
    }
  }

  /**
   * Permet d'affecter startGame d'une Room à un index spécifique à true puis envoi cette mise à jour au client et appelle intervalRoom()
   * @name teamReady
   * @param { Array<Object> } team
   * @param { Array<Object> } rooms
   * @param { string } roomId
  */
  function teamReady(team, rooms, roomId) {
    // Uniquement si team.length > 1 et tout les Player de team on start à true
    if(team[1] && team.length === team.filter(player => player.start).length) {
      const roomIndex = getRoomIndex(rooms, roomId);
      rooms[roomIndex].startGame = true;
      io.emit('getRoom', rooms[roomIndex].startGame, team);
      intervalRoom(rooms, roomId, team);
    }
  }

  /**
   * Permet de decrementer le chrono du Game pour une Room à un index specifique dans un Array de Room toute les secondes
   * Envoi la mise à jour du chrono au client
   * @name intervalRoom
   * @param { Array<Object> } rooms
   * @param { string } roomId
   * @param { Array<Object> } team
  */
  function intervalRoom(rooms, roomId, team) {
    const idIntervalChrono = setInterval(() => {
      const roomIndex = getRoomIndex(rooms, roomId);
      // uniquement si la Room existe toujours et que le chrono du Game est > à 0 et que le Game n'est pas terminé
      if (rooms[roomIndex] && rooms[roomIndex].game.chrono > 0 && rooms[roomIndex].game.ended !== true) {
        rooms[roomIndex].game.chrono--;
        io.emit('updateRoomChrono', rooms[roomIndex].game.chrono, team);
      } else clearInterval(idIntervalChrono);
    }, 1000);
  }

  /**
   * Permet de retourner l'index d'un Clue dans un Array de Clue en fonction de son id
   * @name getClueIndex
   * @param { Array<Object> } clues
   * @param { number } id
   * @return { number }
  */
  function getClueIndex(clues, id) {
    const index = clues.findIndex(clue => clue.id === id);
    return index;
  }

  /**
   * Permet de retourner l'heure actuelle au format hh:mm
   * @name getDateHours
   * @return { string }
  */
  function getDateHours() {
    const now = new Date();
    const hour = now.getHours() < 10 ? `0${now.getHours()}`: now.getHours();
    const min = now.getMinutes() < 10 ? `0${now.getMinutes()}`: now.getMinutes();
    return `${hour}:${min}`;
  }

  /**
   * Permet de creer une note de l'IA avec un message approprié si dans le message de la Note reçu en parametre il y a le mot 'indice'
   * @name talkToRobot
   * @param { Object } note
   * @param { Array<Object> } rooms
   * @param { string } roomId
   * @param { Array<Object> } players
   * @param { JSON } robotConversation
  */
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
          const note = createNote(messages[0], 'robot.svg', 'robot0', 'game master');
          roomIndex = getRoomIndex(rooms, roomId);
          rooms[roomIndex].notes.push(note);
          const team = getTeam(players, roomId);
          // envoi la Note au client
          io.emit('updateMessages', note, team);
          messages.splice(0, 1);
        } else clearInterval(idInterval);
      }, 1000);
    }
  }

  /**
   * Permet retourner un Note
   * @name createNote
   * @param { string } message
   * @param { string } avatar
   * @param { string } id
   * @param { string } pseudo
  */
  function createNote(message, avatar, id, pseudo) {
    return {
      message: message,
      avatar: avatar,
      id: id,
      pseudo: pseudo,
      date: getDateHours()
    }
  }

};

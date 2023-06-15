/****************************************************************************
  Nom ......... : socket.js
  Rôle ........ : fonctions d'ecoutes d'évènements socket pour le client
  Auteur ...... : Jeremy Fouquet
  Version ..... : V1.0 du 14/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const socket = io(); // client socket connect to socket server
const playground = new Playground(socket);

/**
 * Appelle les fonctions setRoom() et changeChronoRoom() de l'objet playground
 * @name setRoom
 * @param { Room } room
*/
socket.on('setRoom', (room) => {
    playground.setRoom(room);
    playground.changeChronoRoom();
});

/**
 * Appelle la fonction back() de l'objet playground si le nombre de Player dans la team est < 2 lorsque le chrono est à 0 Sinon appelle les fonctions setTeam() et changeTeam() de l'objet playground
 * @name getTeam
 * @param { Array<Player> } team
*/
socket.on('getTeam', (team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if (currentPlayer) {
        if(!team[1] && playground.room.chrono === 0) {
            playground.back();
        } else {
            playground.setTeam(team);
            playground.changeTeam();
        }
    }
});

/**
 * Appelle la fonction setStartGame() de l'objet room et si la Room est prête alors appelle la fonction stratGame de l'objet playground
 * @name getRoom
 * @param { boolean } startGame
 * @param { Array<Player> } team
*/
socket.on('getRoom', (startGame, team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        playground.room.setStartGame(startGame);
        if(playground.room.startGame) playground.startGame(currentPlayer);
    }
});

/**
 * Appelle la fonction changeChronoRoom() ou la fonction showBtn() de l'objet playground
 * @name getChronoRoom
 * @param { number } chrono
*/
socket.on('getChronoRoom', (chrono) => {
    playground.room.setChrono(chrono);
    const currentPlayer = getCurrentPlayer(playground.team, socket.id);
    // Si le chrono de la Room est > à 0
    if(playground.room.chrono > 0) playground.changeChronoRoom();
    // Sinon Si le currentPlayer est présent dans la playground.team n'est pas encore pret à commencer la partie
    else if(!currentPlayer.start) playground.showBtn();
});

/**
 * Appelle la fonction setTeam() et refreshView() de l'objet playground puis affecte avec la valeur par defaut la Room de l'objet playground
 * @name refreshData
 * @param { Array<Player> } team
*/
socket.on('refreshData', (team) => {
    playground.setTeam(team);
    playground.room = {};
    playground.refreshView();
});

/**
 * Appelle la fonction setChrono() de l'objet game et changeChronoGame() de l'objet playground
 * @name updateRoomChrono
 * @param { number } chrono
 * @param { Array<Player> } team
*/
socket.on('updateRoomChrono', (chrono, team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        playground.room.game.setChrono(chrono);
        playground.changeChronoGame();
    }
});

/**
 * Appelle les fonctions setClues() et setDeck() de l'objet game puis la fonction changeClues() de l'objet playground
 * @name updateClues
 * @param { Game } game
 * @param { Array<Player> } team
*/
socket.on('updateClues', (game, team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if (currentPlayer) {
        playground.room.game.setClues(game.clues);
        playground.room.game.setDeck(game.deck);
        playground.changeClues();
    }
});

/**
 * Appelle la fonction setEnded() de l'objet game et la fonction endedGame() de l'objet playground
 * @name updateRoomEnded
 * @param { boolean } ended
 * @param { Array<Player> } team
*/
socket.on('updateRoomEnded', (ended, team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        playground.room.game.setEnded(ended);
        playground.endedGame();
    }
});

/**
 * Appelle la fonction addNote() de l'objet room et la fonction addMessage() de l'objet playground
 * @name updateMessages
 * @param { Note } note
 * @param { Array<Player> } team
*/
socket.on('updateMessages', (note, team) => {
    // Si le currentPlayer est présent dans la team reçu en parametre
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        playground.room.addNotes(note);
        playground.addMessage(note);
    }
});

/**
 * Retourne le Player parmie un Array de Player en fonction de son id
 * @name getCurrentPlayer
 * @param { Array<Player> } team
 * @param { string } socketId
*/
function getCurrentPlayer(team, socketId) {
    const currentPlayer = team.filter(player => player.id === socketId)[0];
    return currentPlayer;
};
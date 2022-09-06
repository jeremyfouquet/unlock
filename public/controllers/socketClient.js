const socket = io();
const connection = new Connection();

socket.on('setRoom', (room) => {
    connection.setRoom(room);
    connection.changeChronoRoom();
});
socket.on('getTeam', (team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if (currentPlayer) {
        if(!team[1] && connection.room.chrono <= 0) {
            connection.back(socket);
        } else {
            connection.team = team;
            connection.changeTeam();
        }
    }
});
socket.on('getRoom', (newRoom, team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        connection.room = newRoom;
        if(connection.room.startGame) connection.startGame(socket, currentPlayer);
    }
});
socket.on('getChronoRoom', (newChrono) => {
    connection.room.chrono = newChrono;
    const currentPlayer = getCurrentPlayer(connection.team, socket.id);
    if(connection.room.chrono > 0) connection.changeChronoRoom();
    else if(!currentPlayer.start) connection.showBtn();
});
socket.on('refreshData', (team) => {
    connection.team = team;
    connection.room = {}
    connection.refreshView();
});
socket.on('updateRoomChrono', (newChrono, team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        connection.room.game.chrono = newChrono;
        connection.changeChronoGame();
    }
});
socket.on('updateClues', (newGame, team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if (currentPlayer) {
        connection.room.game = newGame;
        connection.changeClues(socket);
    }
});
socket.on('updateRoomEnded', (newEnded, team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        connection.room.game.ended = newEnded;
        connection.endedGame();
    }
});
socket.on('updateMessages', (note, team) => {
    const currentPlayer = getCurrentPlayer(team, socket.id);
    if(currentPlayer) {
        connection.room.notes.push(note);
        connection.addMessage(note, currentPlayer);
    }
});
function getCurrentPlayer (team, socketId) {
    const currentPlayer = team.filter(player => player.id === socketId)[0];
    return currentPlayer;
};
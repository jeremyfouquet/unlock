const socket = io();
const connection = new Connection();

socket.on('setRoom', (newRoom) => {
    connection.room = newRoom;
    connection.changeChronoRoom();
});
socket.on('getTeam', (newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if (currentPlayer) {
        if(!newTeam[1] && connection.room.chrono <= 0) {
            connection.back(socket);
        } else {
            connection.team = newTeam;
            connection.changeTeam();
        }
    }
});
socket.on('getRoom', (newRoom, newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if(currentPlayer) {
        connection.room = newRoom;
        if(connection.room.startGame) connection.startGame(socket, currentPlayer);
    }
});
socket.on('getChronoRoom', (newChrono) => {
    connection.room.chrono = newChrono;
    const currentPlayer = connection.getCurrentPlayer(connection.team, socket.id);
    if(connection.room.chrono > 0) connection.changeChronoRoom();
    else if(!currentPlayer.start) connection.showBtn();
});
socket.on('refreshData', (newTeam) => {
    connection.team = newTeam;
    connection.room = {}
    connection.refreshView();
});
socket.on('updateRoomChrono', (newChrono, newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if(currentPlayer) {
        connection.room.game.chrono = newChrono;
        connection.changeChronoGame();
    }
});
socket.on('updateClues', (newGame, newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if (currentPlayer) {
        connection.room.game = newGame;
        connection.changeClues(socket);
    }
});
socket.on('updateRoomEnded', (newEnded, newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if(currentPlayer) {
        connection.room.game.ended = newEnded;
        connection.endedGame();
    }
});
socket.on('updateMessages', (note, newTeam) => {
    const currentPlayer = connection.getCurrentPlayer(newTeam, socket.id);
    if(currentPlayer) {
        connection.room.notes.push(note);
        connection.addMessage(note, currentPlayer);
    }
});
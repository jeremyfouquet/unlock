const socket = io();
socket.on('setRoom', (newRoom) => {
    room = newRoom;
    setRoomId(room.id);
    changeChronoRoom(room.chrono);
});
socket.on('getTeam', (newTeam) => {
    const currentPlayer = newTeam.filter(p => p.id === socket.id)[0];
    if (currentPlayer) {
        if(!newTeam[1] && room.chrono <= 0) {
            back(socket);
        } else {
            team = newTeam;
            changeTeam(team);
        }
    }
});
socket.on('getRoom', (newRoom, newTeam) => {
    const currentPlayer = newTeam.filter(p => p.id === socket.id)[0];
    if(currentPlayer) {
        room = newRoom;
        if(room.startGame) startGame(socket);
    }
});
socket.on('getChronoRoom', (newChrono) => {
    room.chrono = newChrono;
    if(room.chrono > 0) changeChronoRoom(room.chrono);
    else showBtn();
});
socket.on('refreshData', (newTeam, newPlayer) => {
    player = newPlayer;
    team = newTeam;
    room = {}
    refreshView();
});
socket.on('updateRoomChrono', (newChrono, newTeam) => {
    const currentPlayer = newTeam.filter(p => p.id === socket.id)[0];
    if(currentPlayer) {
        room.game.chrono = newChrono;
        changeChronoGame(room.game.chrono);
    }
});
socket.on('updateClues', (newGame, newTeam) => {
    const currentPlayer = newTeam.filter(p => p.id === socket.id)[0];
    if (currentPlayer) {
        room.game = newGame;
        changeClues(room.game.clues, socket);
    }
});
socket.on('updateRoomEnded', (newEnded, newTeam) => {
    const currentPlayer = newTeam.filter(p => p.id === socket.id)[0];
    if(currentPlayer) {
        room.game.ended = newEnded;
        endedGame();
    }
});
const playground = new Playground();
playground.socket.on('setRoom', (room) => {
    playground.setRoom(room);
    playground.changeChronoRoom();
});
playground.socket.on('getTeam', (team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if (currentPlayer) {
        if(!team[1] && playground.room.chrono === 0) {
            playground.back();
        } else {
            playground.setTeam(team);
            playground.changeTeam();
        }
    }
});
playground.socket.on('getRoom', (startGame, team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if(currentPlayer) {
        playground.room.setStartGame(startGame);
        if(playground.room.startGame) playground.startGame(currentPlayer);
    }
});
playground.socket.on('getChronoRoom', (chrono) => {
    playground.room.setChrono(chrono);
    const currentPlayer = getCurrentPlayer(playground.team, playground.socket.id);
    if(playground.room.chrono > 0) playground.changeChronoRoom();
    else if(!currentPlayer.start) playground.showBtn();
});
playground.socket.on('refreshData', (team) => {
    playground.setTeam(team);
    playground.room = {};
    playground.refreshView();
});
playground.socket.on('updateRoomChrono', (chrono, team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if(currentPlayer) {
        playground.room.game.setChrono(chrono);
        playground.changeChronoGame();
    }
});
playground.socket.on('updateClues', (game, team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if (currentPlayer) {
        playground.room.game.setClues(game.clues);
        playground.room.game.setDeck(game.deck);
        playground.changeClues();
    }
});
playground.socket.on('updateRoomEnded', (ended, team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if(currentPlayer) {
        playground.room.game.setEnded(ended);
        playground.endedGame();
    }
});
playground.socket.on('updateMessages', (note, team) => {
    const currentPlayer = getCurrentPlayer(team, playground.socket.id);
    if(currentPlayer) {
        playground.room.addNotes(note);
        playground.addMessage(note);
    }
});

function getCurrentPlayer(team, socketId) {
    const currentPlayer = team.filter(player => player.id === socketId)[0];
    return currentPlayer;
};
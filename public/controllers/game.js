let room = {};
let team = [];

function startGame() {
    $('#waiting').hide();
    $('#chronoRoom').show();
    $('#instructions').hide();
    $('#room-section').show();
    $('#navbar-info').css('display', 'flex');
    setNavbarInfo();
    // window.history.pushState(nextState, nextTitle, `/room/?room=${room.id}&player=${socket.id}`);
    // This will replace the current entry in the browser's history, without reloading
    // window.history.replaceState({}, 'Unlock', `/room/?room=${room.id}&player=${socket.id}`)
    // document.location.replace=`/room/?room=${room.id}&player=${socket.id}`;
}

function setNavbarInfo() {
    changeChronoGame(room.game.chrono);
    // const titleTraget = $('#titleGame')[0];
    // titleTraget.innerHTML = room.game.name;
}
function changeChronoGame(gameChrono) {
    const chronoTraget = $('#chronoGame')[0];
    chronoTraget.innerHTML = getChrono(gameChrono);
}
function getChrono(newChrono) {
    const d = Number(newChrono);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let mDisplay = m < 10 ? `0${m}` : `${m}`;
    let sDisplay = s < 10 ? `0${s}` : `${s}`;
    return `${mDisplay}:${sDisplay}`;
}

function searchClue(event, socketClient) {
    event.preventDefault();
    const clueNum = parseInt($('#clue-form input[name="clue"]').val());
    console.log(clueNum);
    console.log(room.game.clues);
    const finded = room.game.clues.find(clue => clue.numsClues.includes(clueNum)) ? true : false;
    if (finded) {
        addClue(clueNum, socketClient);
    } else {
        console.log('penalty');
    //   this._roomService.penalty(60, this._getRoomId());
    }
    $('#clue-form')[0].reset();
}

function addClue(clueNum, socketClient) {
    if(!room.game.clues.filter(clue => clue.id === +clueNum)[0]) socketClient.emit('addClue', clueNum, room.id);
}

function refreshClues(clues) {
    console.log(clues);
}


// function getCurrentPlayer(newTeam, playerId) {
//     const currentPlayer = newTeam.filter(player => player.id === playerId)[0];
//     return currentPlayer;
// }
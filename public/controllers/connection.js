const socket = io();
let player = {
    id: '',
    pseudo: '',
    avatar: '',
    roomId: '',
    start: false
};

let room = {
    id: '',
    chrono: 0,
    game: {},
    startGame: false,
    notes: []
};

let team = [];

let chrono;

let pseudo = $('#pseudo')[0];

let avatar = document.querySelector('input[name="avatars"]:checked');

$('#connection-form input[name="avatars"]').on('change', function(e) {
    avatar = e.target;
});

$('#connection-form').on('submit', function (e) {
    e.preventDefault();
    player.id = socket.id;
    player.pseudo = pseudo.value;
    player.avatar = avatar.value;
    $('#connection-form').hide();
    $('#instructions').show();
    changePlayer(player.pseudo, player.avatar);
});
socket.on('getPlayerId', (playerId) => {
    player.id = playerId;
});
socket.on('getRoom', (newRoom, newTeam) => {
    const currentPlayer = getCurrentPlayer(newTeam, player.id);
    if(currentPlayer) {
        const chrono = room.chrono;
        room = newRoom;
        if(chrono === 0) changeChrono();
    }
});
socket.on('getChronoRoom', (newChrono) => {
    room.chrono = newChrono;
    if(room.chrono > 0) changeChrono();
    else {
        $('#chrono').hide();
        $('#btn-container').show();
    }
});
socket.on('refreshTeam', (newTeam) => {
    team = newTeam;
    const currentPlayer = getCurrentPlayer(team, player.id);
    if(!currentPlayer) room = {
        id: '',
        chrono: 0,
        game: {},
        startGame: false,
        notes: []
    };
});
socket.on('getTeam', (newTeam) => {
    const currentPlayer = getCurrentPlayer(newTeam, player.id);
    if (currentPlayer) {
        if(!team[1] && room.chrono <= 0) {
            socket.emit('back', player.roomId);
        } else {
            team = newTeam;
            team.forEach(newPlayer => {
                changeTeam(newPlayer);
            });
        }
    }
});
socket.on('updateRoomChrono', (newChrono, newTeam) => {
    const currentPlayer = getCurrentPlayer(newTeam, player.id);
    if(currentPlayer) {
        room.game.chrono = newChrono;
    }
});
function changePlayer(newPseudo, newAvatar, newChrono) {
    socket.emit('changePlayerAndGetRoom', newPseudo, newAvatar, newChrono);
};
function getCurrentPlayer(newTeam, playerId) {
    const currentPlayer = newTeam.filter(player => player.id === playerId)[0];
    return currentPlayer;
}

function changeChrono() {
    const chronoTraget = $('#chrono')[0];
    chronoTraget.innerHTML = getChrono(room.chrono);
}

function getChrono(newChrono) {
    const d = Number(newChrono);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var mDisplay = m;
    var sDisplay = s;
    return mDisplay+':'+sDisplay;
}

function changeTeam(newPlayer) {
    const element = $(`#${newPlayer.id}`);
    if(!element[0]) {
        const teamTraget = $('#team')[0];
        const div = document.createElement("div");
        div.setAttribute('id', newPlayer.id);
        const img = document.createElement("img");
        img.setAttribute('src', `/assets/${newPlayer.avatar}`);
        img.setAttribute('alt', 'avatar');
        img.setAttribute('class', 'avatar');
        const p = document.createElement("p");
        p.innerHTML = newPlayer.pseudo
        div.appendChild(img);
        div.appendChild(p);
        teamTraget.appendChild(div);
    }
}

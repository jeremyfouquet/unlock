let player = {
    id: '',
    pseudo: '',
    avatar: '',
    roomId: '',
    start: false
};

$('#connection-form input[name="avatars"]').on('change', function(e) {
    avatar = e.target;
});

function connection(event, socketClient) {
    event.preventDefault();
    player.id = socketClient.id;
    player.pseudo = $('#pseudo')[0].value;
    player.avatar = document.querySelector('input[name="avatars"]:checked').value;
    $('#connection-form').hide();
    $('#instructions').show();
    socketClient.emit('addOrUpdatePlayer', player);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameIndex = urlParams.get('game');
    socketClient.emit('createOrJoinRoom', gameIndex);
};
function setRoomId(roomId) {
    player.roomId = roomId;
}
function changeChronoRoom(roomChrono) {
    const chronoTraget = $('#chronoRoom')[0];
    chronoTraget.innerHTML = getChrono(roomChrono);
}
function getChrono(newChrono) {
    const d = Number(newChrono);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let mDisplay = m < 10 ? `0${m}` : `${m}`;
    let sDisplay = s < 10 ? `0${s}` : `${s}`;
    return `${mDisplay}:${sDisplay}`;
}
function changeTeam(newTeam) {
    newTeam.forEach(newPlayer => {
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
    });
    const divToRemove = [];
    $('#team > div').each(function (e) {
        const id = $('#team')[0].children[e].id;
        const playerFinded = newTeam.filter(p => p.id === id)[0];
        if(!playerFinded) divToRemove.push(id);
    });
    divToRemove.forEach(id => {
        $('div').remove(`#${id}`);
    });
}
function showBtn() {
    $('#chronoRoom').hide();
    $('#btn-container').show();
}
function start(socketClient) {
    $('#btn-container').hide();
    $('#waiting').show();
    socketClient.emit('start', player.roomId);
}
function back(socketClient) {
    socketClient.emit('back', player.roomId);
}
function refreshView() {
    $('#waiting').hide();
    $('#btn-container').hide();
    $('#chronoRoom').show();
    $('#instructions').hide();
    $('#connection-form').show();
}

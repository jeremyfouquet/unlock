const player = {
    id: '',
    pseudo: '',
    avatar: '',
    roomId: '',
    start: false
}

const socket = io();

const pseudo = $('#pseudo');
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

    console.log(player);
});
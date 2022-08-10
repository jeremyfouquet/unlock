let room = {};
let team = [];

function startGame() {
    $('#waiting').hide();
    $('#chronoRoom').show();
    $('#instructions').hide();
    $('#room-section').show();
    $('#navbar-info').css('display', 'flex');
    setNavbarInfo();
    changeClues(room.game.clues);
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

function changeClues(clues) {
    clues.forEach(clue => {
        const element = $(`#cards #${clue.id}`);
        if(!element[0]) {
            // VERSO CARD
            const cards = $('#cards')[0];
            const div1 = document.createElement("div");
            div1.setAttribute('id', `clue${clue.id}`);
            div1.setAttribute('class', 'card return');
            const div2 = document.createElement("div");
            div2.setAttribute('class', 'face recto');
            const div3 = document.createElement("div");
            const bc = clue.type === 'combinable' ? clue.type.combinable : 'bc-white';
            div3.setAttribute('class', `card-title ${bc}`);
            const h3 = document.createElement("h3");
            h3.innerHTML = `${clue.name} ${clue.id}`;
            const span = document.createElement("span");
            span.innerHTML = '🔁';
            span.addEventListener('click', function handleClick(event) {
                $(`#clue${clue.id}`).toggleClass('return');
            });
            div3.appendChild(h3);
            div3.appendChild(span);
            const img = document.createElement("img");
            img.setAttribute('src', `/assets/${clue.img}`);
            img.setAttribute('alt', 'Card image');
            img.setAttribute('class', 'card-img-top');
            div2.appendChild(div3);
            div2.appendChild(img);
            div1.appendChild(div2);
            cards.appendChild(div1);
            // RECTO CARD
        }
    });
    const divToRemove = [];
    $('#cards > div').each(function (e) {
        const id = $('#cards')[0].children[e].id;
        console.log('id', id);
        const clueFinded = clues.filter(clue => `clue${clue.id}` === id)[0];
        console.log('finded', clueFinded);
        if(!clueFinded) divToRemove.push(id);
    });
    divToRemove.forEach(id => {
        $('div').remove(`#${id}`);
    });
}


// function getCurrentPlayer(newTeam, playerId) {
//     const currentPlayer = newTeam.filter(player => player.id === playerId)[0];
//     return currentPlayer;
// }
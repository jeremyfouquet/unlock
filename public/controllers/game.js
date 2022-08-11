let room = {};
let team = [];

function startGame(socketClient) {
    $('#waiting').hide();
    $('#chronoRoom').show();
    $('#instructions').hide();
    $('#room-section').show();
    $('#navbar-info').css('display', 'flex');
    changeChronoGame(room.game.chrono);
    changeClues(room.game.clues, socketClient);
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
    const finded = room.game.clues.find(clue => clue.numsClues.includes(clueNum)) ? true : false;
    if (finded) {
        addClue(clueNum, socketClient);
    } else {
        socketClient.emit('penalty', 60, room.id);
    }
    $('#clue-form')[0].reset();
}

function addClue(clueNum, socketClient) {
    if(!room.game.clues.filter(clue => clue.id === clueNum)[0]) socketClient.emit('addClue', clueNum, room.id);
}

function changeClues(clues, socketClient) {
    clues.forEach(clue => {
        const element = $(`#cards #clue${clue.id}`);
        if(!element[0]) {
            const cards = $('#cards')[0];
            const card = document.createElement("div");
            card.setAttribute('id', `clue${clue.id}`);
            card.setAttribute('class', 'card col-lg-3 col-md-4 col-sm-6 col-7');
            // RECTO CARD
            const recto = document.createElement("div");
            recto.setAttribute('class', 'face recto bg-lightgrey');
            const title = document.createElement("div");
            const bc = clue.type === 'combinable' ? clue.combinable.color : 'bg-white';
            title.setAttribute('class', `card-title ${bc}`);
            const h4 = document.createElement("h4");
            h4.innerHTML = `${clue.name} ${clue.id}`;
            const span = document.createElement("span");
            span.innerHTML = '🔁';
            span.addEventListener('click', function handleClick(event) {
                event.preventDefault();
                $(`#clue${clue.id}`).toggleClass('return');
            });
            title.appendChild(h4);
            title.appendChild(span);
            const img = document.createElement("img");
            img.setAttribute('src', `/assets/${clue.img}`);
            img.setAttribute('alt', 'Card image');
            img.setAttribute('class', 'card-img-top');
            recto.appendChild(title);
            recto.appendChild(img);
            card.appendChild(recto);
            // VERSO CARD
            const verso = document.createElement("div");
            verso.setAttribute('class', 'face verso bg-lightgrey');
            const titleBis = document.createElement("div");
            titleBis.setAttribute('class', `card-title ${bc}`);
            const h4Bis = document.createElement("h4");
            h4Bis.innerHTML = `${clue.name} ${clue.id}`;
            const spanBis = document.createElement("span");
            spanBis.innerHTML = '🔁';
            spanBis.addEventListener('click', function handleClick(event) {
                event.preventDefault();
                $(`#clue${clue.id}`).toggleClass('return');
            });
            titleBis.appendChild(h4Bis);
            titleBis.appendChild(spanBis);
            verso.appendChild(titleBis);
            const body = document.createElement("div");
            body.setAttribute('class', 'card-body');
            const description = document.createElement("p");
            description.innerHTML = clue.description;
            body.appendChild(description);
            if(clue.type === 'combinable') {
                const formcombine = document.createElement("form");
                formcombine.setAttribute('name', 'combination');
                const hcombine = document.createElement("h4");
                hcombine.setAttribute('class', 'form-label');
                hcombine.innerHTML = 'Combiner';
                const inputcombine = document.createElement("input");
                inputcombine.setAttribute('class', 'form-control');
                inputcombine.setAttribute('type', 'number');
                inputcombine.setAttribute('placeholder', 'Entrez un numéro');
                inputcombine.setAttribute('minLength', '1');
                inputcombine.setAttribute('maxLength', '3');
                formcombine.addEventListener('submit', function handleSubmit(event){
                    event.preventDefault();
                    const inputValue = parseInt(inputcombine.value);
                    const somme = inputValue + clue.combinable.numClue;
                    if (somme === clue.combinable.numCombine) {
                        addClue(somme, socketClient);
                    } else {
                        socketClient.emit('penalty', 60, room.id);
                    }
                    formcombine.reset();
                });
                formcombine.appendChild(hcombine);
                formcombine.appendChild(inputcombine);
                body.appendChild(formcombine);
            }
            if (clue.type === 'machine') {
                const button = document.createElement("button");
                button.setAttribute('class', 'btn bg-lightgrey');
                button.innerHTML = 'Utiliser';
                button.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    $(`#clue${clue.id} div.card-body`).hide();
                    $(`#clue${clue.id} form.card-body`).show();
                });
                body.appendChild(button);
                const formcode = document.createElement("form");
                formcode.setAttribute('class', 'card-body');
                const question = document.createElement("p");
                question.innerHTML = 'Séléctionnez une réponse';
                formcode.appendChild(question);
                clue.machine.choice.forEach(choice => {
                    const divFormCode = document.createElement("div");
                    divFormCode.setAttribute('class', 'form-check');
                    const inputFormCode = document.createElement("input");
                    inputFormCode.setAttribute('class', 'form-check-input');
                    inputFormCode.setAttribute('type', 'radio');
                    inputFormCode.setAttribute('value', choice);
                    inputFormCode.setAttribute('name', 'choice');
                    const label = document.createElement("label");
                    label.setAttribute('class', 'form-check-label');
                    label.setAttribute('for', 'choice');
                    const imgLabel = document.createElement("img");
                    imgLabel.setAttribute('class', 'card-img-top');
                    imgLabel.setAttribute('src', `/assets/${choice}`);
                    imgLabel.setAttribute('alt', 'choix');
                    label.appendChild(imgLabel);
                    divFormCode.appendChild(inputFormCode);
                    divFormCode.appendChild(label);
                    formcode.appendChild(divFormCode);
                });
                const buttonFormCode = document.createElement("button");
                buttonFormCode.setAttribute('class', 'btn bg-lightgrey me-2');
                buttonFormCode.setAttribute('type', 'submit');
                buttonFormCode.innerHTML = 'Valider';
                buttonFormCode.addEventListener('click', function handleSubmit(event){
                    event.preventDefault();
                    const inputValue = $(`#clue${clue.id} .form-check-input:checked[type=radio]`).val();
                    console.log('todo function', inputValue);
                });
                const buttonBackToBody = document.createElement("button");
                buttonBackToBody.setAttribute('class', 'btn bg-grey');
                buttonBackToBody.innerHTML = 'Retour';
                buttonBackToBody.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    $(`#clue${clue.id} div.card-body`).show();
                    $(`#clue${clue.id} form.card-body`).hide();
                });
                formcode.appendChild(buttonFormCode);
                formcode.appendChild(buttonBackToBody);
                verso.appendChild(formcode);
            }
            verso.appendChild(body);
            card.appendChild(verso);
            cards.appendChild(card);
        }
    });
    const divToRemove = [];
    $('#cards > div').each(function (e) {
        const id = $('#cards')[0].children[e].id;
        const clueFinded = clues.filter(clue => `clue${clue.id}` === id)[0];
        if(!clueFinded) divToRemove.push(id);
    });
    divToRemove.forEach(id => {
        $('div').remove(`#${id}`);
    });
}
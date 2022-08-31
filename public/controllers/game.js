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
            card.setAttribute('class', 'card col-xl-3 col-lg-4 col-md-5 col-sm-6 col-7');
            // RECTO CARD
            const recto = document.createElement("div");
            recto.setAttribute('class', 'face recto bg-lightgrey');
            const title = document.createElement("div");
            const bc = clue.type === 'combinable' ? clue.combinable.color : 'bg-white';
            title.setAttribute('class', `card-title ${bc}`);
            const h4 = document.createElement("h5");
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
                inputcombine.setAttribute('type', 'text');
                inputcombine.setAttribute('placeholder', 'Entrez un numéro');
                inputcombine.setAttribute('required', true);
                inputcombine.setAttribute('pattern', '[0-9]{1,3}');
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
                const formMachine = document.createElement("form");
                formMachine.setAttribute('class', 'card-body');
                formMachine.addEventListener('submit', function handleSubmit(event){
                    event.preventDefault();
                    const inputValue = $(`#clue${clue.id} .form-check-input:checked[type=radio]`).val();
                    if (inputValue === clue.machine.response) {
                        addClue(clue.machine.replaceClue, socketClient);
                    } else {
                        socketClient.emit('penalty', 60, room.id);
                    }
                });
                const question = document.createElement("p");
                question.innerHTML = 'Séléctionnez une réponse';
                formMachine.appendChild(question);
                clue.machine.choice.forEach(choice => {
                    const divFormMachine = document.createElement("div");
                    divFormMachine.setAttribute('class', 'form-check');
                    const inputFormMachine = document.createElement("input");
                    inputFormMachine.setAttribute('class', 'form-check-input');
                    inputFormMachine.setAttribute('type', 'radio');
                    inputFormMachine.setAttribute('value', choice);
                    inputFormMachine.setAttribute('name', 'choice');
                    inputFormMachine.setAttribute('required', true);
                    const label = document.createElement("label");
                    label.setAttribute('class', 'form-check-label');
                    label.setAttribute('for', 'choice');
                    label.addEventListener('click', function handleSubmit(event){
                        event.preventDefault();
                        inputFormMachine.click();
                    });
                    const imgLabel = document.createElement("img");
                    imgLabel.setAttribute('class', 'card-img-top');
                    imgLabel.setAttribute('src', `/assets/${choice}`);
                    imgLabel.setAttribute('alt', 'choix');
                    label.appendChild(imgLabel);
                    divFormMachine.appendChild(inputFormMachine);
                    divFormMachine.appendChild(label);
                    formMachine.appendChild(divFormMachine);
                });
                const buttonFormMachine = document.createElement("button");
                buttonFormMachine.setAttribute('class', 'btn bg-lightgrey me-2');
                buttonFormMachine.setAttribute('type', 'submit');
                buttonFormMachine.innerHTML = 'Valider';
                const buttonBackToBody = document.createElement("button");
                buttonBackToBody.setAttribute('class', 'btn bg-grey');
                buttonBackToBody.innerHTML = 'Retour';
                buttonBackToBody.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    $(`#clue${clue.id} div.card-body`).show();
                    $(`#clue${clue.id} form.card-body`).hide();
                });
                formMachine.appendChild(buttonFormMachine);
                formMachine.appendChild(buttonBackToBody);
                verso.appendChild(formMachine);
            }
            if (clue.type === 'code') {
                const formcode = document.createElement("form");
                const desactiveInput = document.createElement("div");
                desactiveInput.setAttribute('id', 'desactiveInput');
                const inputcode = document.createElement("input");
                inputcode.setAttribute('type', 'text');
                inputcode.setAttribute('class', 'form-control');
                inputcode.setAttribute('placeholder', 'Entrez un code');
                inputcode.setAttribute('required', true);
                inputcode.setAttribute('pattern', '[0-9]{4}');
                const keyboard = document.createElement("div");
                keyboard.setAttribute('id', 'keyboard');
                keyboard.setAttribute('class', 'bg-white');
                [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]].forEach(keys => {
                    const keyGroup = document.createElement("div");
                    keyGroup.setAttribute('class', 'd-flex flex-lg-nowrap justify-content-around');
                    keys.forEach(numKey => {
                        const key = document.createElement("div");
                        key.setAttribute('class', 'key white bg-grey');
                        const h3key = document.createElement("h5");
                        h3key.innerHTML = numKey;
                        key.appendChild(h3key);
                        key.addEventListener('click', function handleClick(event) {
                            event.preventDefault();
                            console.log(inputcode.value);
                            inputcode.value = inputcode.value ? +`${inputcode.value}${numKey}` : numKey;
                        });
                        keyGroup.appendChild(key);
                    });
                    keyboard.appendChild(keyGroup);
                });
                const btnKeyboard = document.createElement("div");
                btnKeyboard.setAttribute('class', 'd-flex flex-lg-nowrap justify-content-around');
                const btnKeyboardSubmit = document.createElement("button");
                btnKeyboardSubmit.setAttribute('type', 'submit');
                btnKeyboardSubmit.setAttribute('class', 'btn bg-lightgrey');
                btnKeyboardSubmit.innerHTML = 'Valider';
                const btnKeyboardCancel = document.createElement("div");
                btnKeyboardCancel.setAttribute('class', 'btn bg-grey');
                btnKeyboardCancel.innerHTML = 'Cancel';
                btnKeyboardCancel.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    formcode.reset();
                });
                formcode.addEventListener('submit', function handleSubmit(event){
                    event.preventDefault();
                    const inputValue = parseInt(inputcode.value);
                    if (inputValue === room.game.code) {
                        socketClient.emit('winGame', room.id);
                    } else {
                        socketClient.emit('penalty', 60, room.id);
                        formcode.reset();
                    }
                });
                btnKeyboard.appendChild(btnKeyboardSubmit);
                btnKeyboard.appendChild(btnKeyboardCancel);
                keyboard.appendChild(btnKeyboard);
                formcode.appendChild(desactiveInput);
                formcode.appendChild(inputcode);
                formcode.appendChild(keyboard);
                body.appendChild(formcode);
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
function endedGame() {
    $('#cards').hide();
    $('#navbar-info').css('display', 'none');
    $('#end-message > p').text(room.game.chrono > 0 ? `Bravo vous avez réussi à sortir en ${getChrono(room.game.chrono)} minutes !` : 'Domage ! Le temps est écoulé !')
    $('#end-message').show();
}
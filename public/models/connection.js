function Connection () {
    this.room = {};
    this.team = [];

    this.connection = function (event, socketClient) {
        event.preventDefault();
        // const newPlayer = new Player(socketClient.id, $('#pseudo')[0].value, document.querySelector('input[name="avatars"]:checked').value);
        // console.log(newPlayer.getInfo);
        const currentPlayer = {
            id: socketClient.id,
            pseudo: $('#pseudo')[0].value,
            avatar: document.querySelector('input[name="avatars"]:checked').value,
            roomId: '',
            start: false
        }
        $('#connection-form').hide();
        $('#instructions').show();
        socketClient.emit('addOrUpdatePlayer', currentPlayer);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const gameIndex = urlParams.get('game');
        socketClient.emit('createOrJoinRoom', gameIndex);
    };
    this.changeChronoRoom = function() {
        const chronoTraget = $('#chronoRoom')[0];
        chronoTraget.innerHTML = this.getChrono(this.room.chrono);
    }
    this.changeChronoGame = function() {
        const chronoTraget = $('#chronoGame')[0];
        chronoTraget.innerHTML = this.getChrono(this.room.game.chrono);
    }
    this.getChrono = function(newChrono) {
        const d = Number(newChrono);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);
        let mDisplay = m < 10 ? `0${m}` : `${m}`;
        let sDisplay = s < 10 ? `0${s}` : `${s}`;
        return `${mDisplay}:${sDisplay}`;
    }
    this.changeTeam = function() {
        const that = this;
        this.team.forEach(newPlayer => {
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
            const playerFinded = that.team.filter(p => p.id === id)[0];
            if(!playerFinded) divToRemove.push(id);
        });
        divToRemove.forEach(id => {
            $('div').remove(`#${id}`);
        });
    }
    this.showBtn = function() {
        $('#chronoRoom').hide();
        $('#btn-container').show();
    }
    this.start = function(socketClient) {
        $('#btn-container').hide();
        $('#waiting').show();
        socketClient.emit('start', this.room.id);
    }
    this.back = function(socketClient) {
        socketClient.emit('back', this.room.id);
    }
    this.refreshView = function() {
        $('#waiting').hide();
        $('#btn-container').hide();
        $('#chronoRoom').show();
        $('#instructions').hide();
        $('#connection-form').show();
    }
    this.startGame = function(socketClient, currentPlayer) {
        $('#waiting').hide();
        $('#chronoRoom').show();
        $('#instructions').hide();
        $('#room-section').show();
        $('#navbar-info').css('display', 'flex');
        $('#chatForm .card-footer img').attr('src',`/assets/${currentPlayer.avatar}`);
        this.changeChronoGame();
        this.changeClues(socketClient);
        this.room.notes.forEach(note => {
            this.addMessage(note, currentPlayer);
        });
        this.toggleChat();
    }
    this.searchClue = function(event, socketClient) {
        event.preventDefault();
        const clueNum = parseInt($('#clue-form input[name="clue"]').val());
        const finded = this.room.game.clues.find(clue => clue.numsClues.includes(clueNum)) ? true : false;
        if (finded) {
            this.addClue(clueNum, socketClient);
        } else {
            socketClient.emit('penalty', 60, this.room.id);
        }
        $('#clue-form')[0].reset();
    }

    this.addClue = function(clueNum, socketClient) {
        if(!this.room.game.clues.filter(clue => clue.id === clueNum)[0]) socketClient.emit('addClue', clueNum, this.room.id);
    }

    this.changeClues = function(socketClient) {
        const that = this;
        this.room.game.clues.forEach(clue => {
            const element = $(`#cards #clue${clue.id}`);
            if(!element[0]) {
                const cards = $('#cards')[0];
                const card = document.createElement("div");
                card.setAttribute('id', `clue${clue.id}`);
                card.setAttribute('class', 'card clue col-xl-3 col-lg-4 col-md-5 col-sm-6 col-7');
                // RECTO CARD
                const recto = document.createElement("div");
                recto.setAttribute('class', 'face recto bg-lightgrey');
                const title = document.createElement("div");
                const bc = clue.type === 'combinable' ? clue.combinable.color : 'bg-white';
                title.setAttribute('class', `card-title ${bc}`);
                const h5 = document.createElement("h5");
                h5.innerHTML = `${clue.name} ${clue.id}`;
                const span = document.createElement("span");
                span.innerHTML = '🔁';
                span.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    $(`#clue${clue.id}`).toggleClass('return');
                });
                title.appendChild(h5);
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
                const h5Bis = document.createElement("h5");
                h5Bis.innerHTML = `${clue.name} ${clue.id}`;
                const spanBis = document.createElement("span");
                spanBis.innerHTML = '🔁';
                spanBis.addEventListener('click', function handleClick(event) {
                    event.preventDefault();
                    $(`#clue${clue.id}`).toggleClass('return');
                });
                titleBis.appendChild(h5Bis);
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
                    const hcombine = document.createElement("h5");
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
                            that.addClue(somme, socketClient);
                        } else {
                            socketClient.emit('penalty', 60, that.room.id);
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
                            that.addClue(clue.machine.replaceClue, socketClient);
                        } else {
                            socketClient.emit('penalty', 60, that.room.id);
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
                                inputcode.value = inputcode.value ? `${inputcode.value}${numKey}` : `${numKey}`;
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
                        if (inputValue === that.room.game.code) {
                            socketClient.emit('winGame', that.room.id);
                        } else {
                            socketClient.emit('penalty', 60, that.room.id);
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
            const clueFinded = that.room.game.clues.filter(clue => `clue${clue.id}` === id)[0];
            if(!clueFinded) divToRemove.push(id);
        });
        divToRemove.forEach(id => {
            $('div').remove(`#${id}`);
        });
    }
    this.endedGame = function() {
        $('#cards').hide();
        $('#navbar-info').css('display', 'none');
        $('#end-message > p').text(this.room.game.chrono > 0 ? `Bravo vous avez réussi à sortir en ${this.getChrono(this.room.game.chrono)} minutes !` : 'Domage ! Le temps est écoulé !')
        $('#end-message').show();
    }
    this.addMessage = function(note, currentPlayer) {
        const element = $(`#chat-messages`)[0];
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        div2.setAttribute('class', 'col-10');
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        if(note.id === currentPlayer.id) {
            div1.setAttribute('class', 'd-flex flex-row justify-content-end');
            p1.setAttribute('class', 'small p-2 me-3 mb-1 text-white rounded-3 bg-primary');
            p2.setAttribute('class', 'small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end');
        } else {
            div1.setAttribute('class', 'd-flex flex-row justify-content-start');
            const img = document.createElement("img");
            img.setAttribute('src', `/assets/${note.avatar}`);
            img.setAttribute('alt', 'Avatar');
            div1.appendChild(img);
            p1.setAttribute('class', 'small p-2 ms-3 mb-1 rounded-3 bg-eggwhite');
            p2.setAttribute('class', 'small ms-3 mb-3 rounded-3 text-muted');
        }
        p1.innerHTML = note.message;
        p2.innerHTML = note.date;
        div2.appendChild(p1);
        div2.appendChild(p2);
        div1.appendChild(div2);
        element.appendChild(div1);
        $("#chatForm .card-body").scrollTop($("#chat-messages").height());
        if ($("#chatForm").css("display") == "none" ) {
            $("#chat-circle").addClass("shake");
        }
    }
    this.toggleChat = function() {
        $("#chat-circle").toggle('scale');
        $("#chatForm").toggle('scale');
        $("#chatForm .card-body").scrollTop($("#chat-messages").height());
        $("#chat-circle").removeClass("shake");
    }
    this.sendMessage = function(event, socketClient) {
        const currentPlayer = this.team.filter(p => p.id === socketClient.id)[0];
        event.preventDefault();
        const message = $('#chatForm input[name="message"]').val();
        socketClient.emit('message', message, currentPlayer, this.room.id);
        $('#chatForm')[0].reset();
    }
    this.getDateHours = function() {
        const now = new Date();
        const hour = now.getHours() < 10 ? `0${now.getHours()}`: now.getHours();
        const min = now.getMinutes() < 10 ? `0${now.getMinutes()}`: now.getMinutes();
        return `${hour}:${min}`;
    }
    this.getCurrentPlayer = function(newTeam, socketId) {
        const currentPlayer = newTeam.filter(p => p.id === socketId)[0];
        return currentPlayer;
    }
}


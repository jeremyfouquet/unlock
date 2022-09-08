function Game (name, chronoStart, chrono, clues, deck, code, ended) {
    this.name = name;
    this.chronoStart = chronoStart;
    this.chrono = chrono;
    this.clues = [];
    this.deck = [];
    this.code = code;
    this.ended = ended;
    this.setChrono = function (chrono) {
        this.chrono = chrono;
    };
    this.setClues = function (clues) {
        this.clues = [];
        clues.forEach(clue => {
            const newClue = new Clue(clue.id, clue.name, clue.description, clue.img, clue.numsClues, clue.discard, clue.type);
            if(clue.type === "combinable") {
                newClue.setCombinable(clue.combinable);
            } else if (clue.type === "machine") {
                newClue.setMachine(clue.machine);
            }
            this.clues.push(newClue);
        });
    };
    this.setDeck = function (deck) {
        this.deck = [];
        deck.forEach(clue => {
            const newClue = new Clue(clue.id, clue.name, clue.description, clue.img, clue.numsClues, clue.discard, clue.type);
            if(clue.type === "combinable") {
                newClue.setCombinable(clue.combinable);
            } else if (clue.type === "machine") {
                newClue.setMachine(clue.machine);
            }
            this.deck.push(newClue);
        });
    };
    this.setEnded = function (ended) {
        this.ended = ended;
    };

    this.setClues(clues);
    this.setDeck(deck);
}
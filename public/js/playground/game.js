const Clue = require('./clue');

function Game (name, chronoStart, chrono, clues, deck, code, ended) {
    this.name = name;
    this.chronoStart = chronoStart;
    this.chrono = chrono;
    this.clues = [];
    this.deck = [];
    this.code = code;
    this.ended = ended;
    /**
     * Affecte this.chrono avec le number passé en parametre
     * @name setChrono
     * @param { number } chrono
    */
    this.setChrono = function (chrono) {
        this.chrono = chrono;
    };

    /**
     * Affecte this.clues avec le Array de Clue passé en parametre
     * @name setClues
     * @param { Array<Clue> } clues
    */
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

    /**
     * Affecte this.deck avec le Array de Clue passé en parametre
     * @name setDeck
     * @param { Array<Clue> } deck
    */
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

    /**
     * Affecte this.ended avec le boolean passé en parametre
     * @name setEnded
     * @param { boolean } ended
    */
    this.setEnded = function (ended) {
        this.ended = ended;
    };

    this.setClues(clues);
    this.setDeck(deck);
}

module.exports = Game;

function Game (name, chronoStart, chrono, clues, deck, code, ended) {
    this.name = name;
    this.chronoStart = chronoStart;
    this.chrono = chrono;
    this.clues = clues;
    this.deck = deck;
    this.code = code;
    this.ended = ended;
    this.setChrono = function (chrono) {
        this.chrono = chrono;
    };
    this.setClues = function (clues) {
        this.clues = clues;
    };
    this.setDeck = function (deck) {
        this.deck = deck;
    };
    this.setEnded = function (ended) {
        this.ended = ended;
    };
}
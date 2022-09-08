function Room (chrono, game, id, notes, startGame) {
    this.chrono = chrono;
    this.game = new Game(game.name, game.chronoStart, game.chrono, game.clues, game.deck, game.code, game.ended);
    this.id = id;
    this.notes = [];
    this.startGame = startGame;
    this.setStartGame = function(startGame) {
        this.startGame = startGame;
    };
    this.setChrono = function (chrono) {
        this.chrono = chrono;
    }
    this.addNotes = function (note) {
        this.notes.push(new Note(note.message, note.avatar, note.id, note.pseudo, note.date));
    }
    notes.forEach(note => {
        this.addNotes(note);
    });
}
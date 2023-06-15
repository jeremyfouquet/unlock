/****************************************************************************
  Nom ......... : room.js
  Rôle ........ : Constructeur de l'objet Room
  Auteur ...... : Jeremy Fouquet
  Version ..... : V1.0 du 31/03/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
function Room (chrono, game, id, notes, startGame) {
    this.chrono = chrono;
    this.game = new Game(game.name, game.chrono, game.clues, game.deck, game.code, game.ended);
    this.id = id;
    this.notes = [];
    this.startGame = startGame;
    /**
     * Affecte this.startGame avec le boolean passé en parametre
     * @name setStartGame
     * @param { boolean } startGame
    */
    this.setStartGame = function(startGame) {
        this.startGame = startGame;
    };

    /**
     * Affecte this.chrono avec le number passé en parametre
     * @name setChrono
     * @param { number } chrono
    */
    this.setChrono = function (chrono) {
        this.chrono = chrono;
    }

    /**
     * Ajoute la Note passé en parametre à this.Note
     * @name addNotes
     * @param { Note } note
    */
    this.addNotes = function (note) {
        this.notes.push(new Note(note.message, note.avatar, note.id, note.pseudo, note.date));
    }
    notes.forEach(note => {
        this.addNotes(note);
    });
}

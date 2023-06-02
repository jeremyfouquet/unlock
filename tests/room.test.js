/****************************************************************************
  Nom ......... : room.test.js
  Rôle ........ : tests unitaires du fichier room.js
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const Room = require('./public/js/playground/room');
const Game = require('./public/js/playground/game');

describe('Room', () => {
  let room;

  beforeEach(() => {
    const game = {
      name: 'Test Game',
      chronoStart: 0,
      chrono: 0,
      clues: [],
      deck: [],
      code: '1234',
      ended: false,
    };

    room = new Room(0, game, 1, [], false);
  });

  it('Doit avoir les bonnes propriétés', () => {
    expect(room.chrono).toBe(0);
    expect(room.game).toBeInstanceOf(Game);
    expect(room.id).toBe(1);
    expect(room.notes).toHaveLength(0);
    expect(room.startGame).toBe(false);
  });

  it('Doit modifier la propriété startGame', () => {
    room.setStartGame(true);

    expect(room.startGame).toBe(true);
  });

  it('Doit modifier la propriété chrono', () => {
    room.setChrono(60);

    expect(room.chrono).toBe(60);
  });

  it('Doit ajouter une note', () => {
    const note = {
      message: 'Test Note',
      avatar: 'avatar.jpg',
      id: 1,
      pseudo: 'TestUser',
      date: '2023-05-18',
    };

    room.addNotes(note);

    expect(room.notes).toHaveLength(1);

    const addedNote = room.notes[0];

    expect(addedNote.message).toBe('Test Note');
    expect(addedNote.avatar).toBe('avatar.jpg');
    expect(addedNote.id).toBe(1);
    expect(addedNote.pseudo).toBe('TestUser');
    expect(addedNote.date).toBe('2023-05-18');
  });

});

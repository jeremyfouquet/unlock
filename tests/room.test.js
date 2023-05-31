const Room = require('../public/js/playground/room');
const Game = require('../public/js/playground/game');

describe('Room', () => {
  let room;
  const game = {
    name: 'Test Game',
    chronoStart: 0,
    chrono: 0,
    clues: [],
    deck: [],
    code: '1234',
    ended: false,
  };

  beforeEach(() => {
    // Créez une instance de room pour chaque test
    room = new Room(0, game, 1, [], false);
  });

  it('should have the correct properties', () => {
    expect(room.chrono).toBe(0);
    expect(room.game).toBeInstanceOf(Game);
    expect(room.id).toBe(1);
    expect(room.notes).toHaveLength(0);
    expect(room.startGame).toBe(false);
  });

  it('should set the startGame flag correctly', () => {
    room.setStartGame(true);
    expect(room.startGame).toBe(true);
  });

  it('should set the chrono correctly', () => {
    room.setChrono(60);
    expect(room.chrono).toBe(60);
  });

  it('should add notes correctly', () => {
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

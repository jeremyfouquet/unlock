const Clue = require('../public/js/clue');
const Game = require('../public/js/game');

describe('Game', () => {
  let game;

  beforeEach(() => {
    // Créez une instance de jeu pour chaque test
    const clues = [
      {
        id: 1,
        name: 'Clue 1',
        description: 'Description 1',
        img: 'image1.jpg',
        numsClues: 3,
        discard: false,
        type: 'combinable',
        combinable: {
          // Propriétés combinables
        },
      },
    ];

    const deck = [
      {
        id: 2,
        name: 'Clue 2',
        description: 'Description 2',
        img: 'image2.jpg',
        numsClues: 2,
        discard: true,
        type: 'machine',
        machine: {
          // Propriétés machine
        },
      },
    ];

    game = new Game('Test Game', 0, 0, clues, deck, '1234', false);
  });

  it('should have the correct properties', () => {
    expect(game.name).toBe('Test Game');
    expect(game.chronoStart).toBe(0);
    expect(game.chrono).toBe(0);
    expect(game.clues).toHaveLength(1);
    expect(game.deck).toHaveLength(1);
    expect(game.code).toBe('1234');
    expect(game.ended).toBe(false);
  });

  it('should set the chrono correctly', () => {
    game.setChrono(60);
    expect(game.chrono).toBe(60);
  });

  it('should set the clues correctly', () => {
    const newClues = [
      {
        id: 3,
        name: 'Clue 3',
        description: 'Description 3',
        img: 'image3.jpg',
        numsClues: 1,
        discard: false,
        type: 'combinable',
        combinable: {
          // Propriétés combinables
        },
      },
    ];

    game.setClues(newClues);

    expect(game.clues).toHaveLength(1);

    const clue = game.clues[0];
    expect(clue).toBeInstanceOf(Clue);
    expect(clue.id).toBe(3);
    expect(clue.name).toBe('Clue 3');
    expect(clue.description).toBe('Description 3');
    // Vérifiez les autres propriétés du Clue si nécessaire
  });

  it('should set the deck correctly', () => {
    const newDeck = [
      {
        id: 4,
        name: 'Clue 4',
        description: 'Description 4',
        img: 'image4.jpg',
        numsClues: 2,
        discard: true,
        type: 'machine',
        machine: {
          // Propriétés machine
        },
      },
    ];

    game.setDeck(newDeck);

    expect(game.deck).toHaveLength(1);

    const clue = game.deck[0];
    expect(clue).toBeInstanceOf(Clue);
    expect(clue.id).toBe(4);
    expect(clue.name).toBe('Clue 4');
    expect(clue.description).toBe('Description 4');
    // Vérifiez les autres propriétés du Clue si nécessaire
  });

  it('should set the ended flag correctly', () => {
    game.setEnded(true);
    expect(game.ended).toBe(true);
  });
});

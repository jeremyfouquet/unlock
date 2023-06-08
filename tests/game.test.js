/****************************************************************************
  Nom ......... : game.test.js
  Rôle ........ : tests unitaires du fichier game.js
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const fs = require('fs');
const path = require('path');

// récupère le contenu d'un fichier JavaScript dans le contexte du test
function readFile(filePath) {
  const resolvedPath = path.resolve(__dirname, filePath);
  return fs.readFileSync(resolvedPath, 'utf-8');
}

// évalue et exécute les fichiers nécessaires aux tests
eval(readFile('../public/js/playground/clue.js'));
eval(readFile('../public/js/playground/game.js'));

describe('Game', () => {
  let game;

  beforeEach(() => {
    const clues = [
      {
        id: 1,
        name: 'Clue 1',
        description: 'Description 1',
        img: 'image1.jpg',
        numsClues: 3,
        discard: false,
        type: 'combinable',
        combinable: {},
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
        machine: {},
      },
    ];

    game = new Game('Test Game', 0, 0, clues, deck, '1234', false);
  });

  it('Doit avoir les bonnes propriétés', () => {
    expect(game.name).toBe('Test Game');
    expect(game.chronoStart).toBe(0);
    expect(game.chrono).toBe(0);
    expect(game.clues).toHaveLength(1);
    expect(game.deck).toHaveLength(1);
    expect(game.code).toBe('1234');
    expect(game.ended).toBe(false);
  });

  it('Doit modifier la propriété chrono', () => {
    game.setChrono(60);

    expect(game.chrono).toBe(60);
  });

  it('Doit modifier la propriété clues', () => {
    const newClues = [
      {
        id: 3,
        name: 'Clue 3',
        description: 'Description 3',
        img: 'image3.jpg',
        numsClues: 1,
        discard: false,
        type: 'combinable',
        combinable: {},
      },
    ];

    game.setClues(newClues);

    expect(game.clues).toHaveLength(1);

    const clue = game.clues[0];

    expect(clue).toBeInstanceOf(Clue);
    expect(clue.id).toBe(3);
  });

  it('Doit modifier la propriété deck', () => {
    const newDeck = [
      {
        id: 4,
        name: 'Clue 4',
        description: 'Description 4',
        img: 'image4.jpg',
        numsClues: 2,
        discard: true,
        type: 'machine',
        machine: {},
      },
    ];

    game.setDeck(newDeck);

    expect(game.deck).toHaveLength(1);

    const clue = game.deck[0];

    expect(clue).toBeInstanceOf(Clue);
    expect(clue.id).toBe(4);
    expect(clue.name).toBe('Clue 4');
    expect(clue.description).toBe('Description 4');
    expect(clue.img).toBe('image4.jpg');
    expect(clue.numsClues).toBe(2);
    expect(clue.discard).toBe(true);
    expect(clue.type).toBe('machine');
  });

  it('Doit modifier la propriété ended', () => {
    game.setEnded(true);

    expect(game.ended).toBe(true);
  });

});

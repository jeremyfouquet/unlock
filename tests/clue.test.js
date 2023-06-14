/****************************************************************************
  Nom ......... : clue.test.js
  Rôle ........ : tests unitaires du fichier clue.js
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

// récupère et évalue le contenu du fichier clue.js dans le contexte du test
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../public/js/playground/clue.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');
eval(fileContent);

describe('Clue', () => {
  let clue;

  beforeEach(() => {
    clue = new Clue(1, 'Clue Name', 'Clue Description', 'clue.jpg', 3, false, 'type');
  });
    
  it('Doit avoir les bonnes propriétés', () => {
    expect(clue.id).toBe(1);
    expect(clue.name).toBe('Clue Name');
    expect(clue.description).toBe('Clue Description');
    expect(clue.img).toBe('clue.jpg');
    expect(clue.numsClues).toBe(3);
    expect(clue.discard).toBe(false);
    expect(clue.type).toBe('type');
    expect(clue.combinable).toEqual({});
    expect(clue.machine).toEqual({});
  });
  
  it('Doit modifier la propriété \'combinable\'', () => {
    const combinableObj = { prop: 'value' };
    clue.setCombinable(combinableObj);

    expect(clue.combinable).toEqual(combinableObj);
  });
    
  it('Doit modifier la propriété \'machine\'', () => {
    const machineObj = { prop: 'value' };
    clue.setMachine(machineObj);

    expect(clue.machine).toEqual(machineObj);
  });

});
  
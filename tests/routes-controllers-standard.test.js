/****************************************************************************
  Nom ......... : routes-controllers-error.test.js
  Rôle ........ : tests d'intégrations des routes standard
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Test des standard routes', () => {

  // attente du chargement de mongoose
  beforeAll((done) => {
    setTimeout(() => {
      mongoose.disconnect(); // aucune utilité
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });

  it('Doit renvoyer home.html', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Un tutoriel très simple');
  });
  
  it('Doit renvoyer playground.html', async () => {
    const response = await request(app).get('/connection?game=0');

    expect(response.status).toBe(200);
    expect(response.text).toContain('En attente des autres joueurs');
  });
  
  it('Doit renvoyer buildingpage.html', async () => {
    const response = await request(app).get('/connection?game=nonexistent');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Ce scénario est en court d\'élaboration par nos équipes !');
  });

});

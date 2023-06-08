/****************************************************************************
  Nom ......... : routes-controllers-error.test.js
  Rôle ........ : tests d'intégrations des routes error
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Test des error routes', () => {

  // attente du chargement de mongoose
  beforeAll((done) => {
    setTimeout(() => {
      mongoose.disconnect(); // aucune utilité
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });

  it('Doit renvoyer 404.html', async () => {
    const response = await request(app).get('/*');

    expect(response.status).toBe(404);
    expect(response.text).toContain('Désolé, une erreur est survenue');
  });
  
});

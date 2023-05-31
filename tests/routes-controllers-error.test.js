const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Attente du chargement de app.js', () => {

  it('Déconnexion de mongoose', (done) => {
    setTimeout(() => {
      mongoose.disconnect();
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
  
});

describe('Test des error routes', () => {

  it('Doit renvoyer 404.html', async () => {
    const response = await request(app).get('/*');

    expect(response.status).toBe(404);
    expect(response.text).toContain('Désolé, une erreur est survenue');
  });
  
});

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

describe('Test des standart routes', () => {

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

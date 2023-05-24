const request = require('supertest');
const server = require('../server');
const app = require('../app');
const cheerio = require('cheerio');

describe('Test des routes utilisateur', () => {
  it('GET / devrait renvoyer home.html', done => {
    request(app).get('/').end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        const $ = cheerio.load(res.text);
        const pageTitle = $('title').text();
        expect(pageTitle).toBe('Unlock');
        done();
    });

    // Effectuez d'autres assertions sur le contenu HTML de la page si nécessaire
  });

  it('GET /connection/? devrait renvoyer buildingpage.html', done => {
    request(app).get('/connection/?').end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        const $ = cheerio.load(res.text);
        const pageTitle = $('title').text();
        expect(pageTitle).toBe('Unlock');
        done();
    });

    // Effectuez d'autres assertions sur le contenu HTML de la page si nécessaire
  });

  it('GET /api/users devrait renvoyer user.html', done => {
    request(app).get('/api/users').end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(200);
        const $ = cheerio.load(res.text);
        const pageTitle = $('title').text();
        expect(pageTitle).toBe('Test MongoDB');
        done();
    });

    // Effectuez d'autres assertions sur le contenu HTML de la page si nécessaire
  });

  it('GET * devrait renvoyer 404.html', done => {    
    request(app).get('/*').end((err, res) => {
        if (err) return done(err);
        expect(res.status).toEqual(404);
        const $ = cheerio.load(res.text);
        const pageTitle = $('title').text();
        expect(pageTitle).toBe('Unlock');
        done();
    });

    // Effectuez d'autres assertions sur le contenu HTML de la page si nécessaire
  });

  afterEach(() => {
    server.close();
  });
  // Ajoutez d'autres tests pour les autres méthodes HTTP et les scénarios spécifiques
});

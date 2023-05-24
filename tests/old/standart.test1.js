const request = require('supertest');
const app = require('../app');
const path = require('path');

describe('Tests des contrôleurs', () => {
  // Test pour la méthode getHome
  it('GET / devrait renvoyer la page d\'accueil', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!-- Contenu de la page d\'accueil -->');
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });

  // Test pour la méthode getBuildPage
  it('GET /build devrait renvoyer la page de construction si le jeu n\'existe pas', async () => {
    const response = await request(app).get('/build?game=unknown');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!-- Contenu de la page de construction -->');
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });

  it('GET /build devrait appeler le middleware suivant si le jeu existe', async () => {
    const response = await request(app).get('/build?game=existingGame');
    // Ajoutez ici les assertions pour vérifier que le middleware suivant a été appelé
  });

  // Test pour la méthode getPlaygroundPage
  it('GET /playground devrait renvoyer la page de playground', async () => {
    const response = await request(app).get('/playground');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!-- Contenu de la page de playground -->');
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });
});

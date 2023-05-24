const request = require('supertest');
const app = require('../app'); // Importez votre application Express

describe('Test des routes utilisateur', () => {
  it('GET /api/users devrait renvoyer 200', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    response.files
    //expect(response.body).toEqual(/* Insérez ici le corps de réponse attendu */);
  });

  // Ajoutez d'autres tests pour les autres méthodes HTTP et les scénarios spécifiques
});

describe('Test des routes utilisateur', () => {
    it('GET /api/users devrait renvoyer la liste des utilisateurs', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      //expect(response.body).toEqual(/* Insérez ici le corps de réponse attendu */);
    });
  
    // Ajoutez d'autres tests pour les autres méthodes HTTP et les scénarios spécifiques
  });

  describe('Test des routes utilisateur', () => {
    it('GET /api/users devrait renvoyer la liste des utilisateurs', async () => {
      const response = await request(app).get('*');
      expect(response.status).toBe(404);
      //expect(response.body).toEqual(/* Insérez ici le corps de réponse attendu */);
    });
  
    // Ajoutez d'autres tests pour les autres méthodes HTTP et les scénarios spécifiques
  });
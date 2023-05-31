// Importez les dépendances nécessaires pour les tests
const { JSDOM } = require('jsdom');
const { Headers } = require('node-fetch'); // Pour émuler l'objet Headers
const { api, getMe, validatePwd, updatePwd, deleteProfil } = require('../public/js/profil');

// Mock de la fonction fetch pour émuler les appels à l'API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Exemple de tests pour la fonction api
describe('api', () => {
  test('envoie une requête avec les options appropriées', async () => {
    const expectedApi = '/api/test';
    const expectedMethod = 'GET';
    const expectedBody = JSON.stringify({ key: 'value' });
    const expectedHeaders = new Headers();
    expectedHeaders.append('Content-Type', 'application/json');

    await api(expectedApi, expectedMethod, expectedBody);

    expect(global.fetch).toHaveBeenCalledWith(expectedApi, {
      method: expectedMethod,
      mode: 'cors',
      body: expectedBody,
      headers: expectedHeaders,
    });
  });
});

// Exemple de tests pour la fonction getMe
describe('getMe', () => {
  beforeEach(() => {
    // Créez un DOM simulé avec JSDOM avant chaque test
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
  });

  afterEach(() => {
    // Supprimez le DOM simulé après chaque test
    delete global.document;
  });

  test('récupère les données de l\'utilisateur et les affiche dans les champs appropriés', async () => {
    const mockResponse = {
      email: 'test@example.com',
      win: 10,
      loose: 5,
    };

    // Mock de la fonction api pour renvoyer une réponse simulée
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    // Créez des éléments DOM simulés pour les champs
    const inputMail = document.createElement('input');
    const inputWin = document.createElement('input');
    const inputLoose = document.createElement('input');
    inputMail.id = 'mail-profil';
    inputWin.id = 'nb-win';
    inputLoose.id = 'nb-loose';
    document.body.appendChild(inputMail);
    document.body.appendChild(inputWin);
    document.body.appendChild(inputLoose);

    await getMe();

    // Vérifiez que les champs ont été mis à jour avec les données de l'utilisateur
    expect(inputMail.value).toBe(mockResponse.email);
    expect(inputWin.value).toBe(mockResponse.win.toString());
    expect(inputLoose.value).toBe(mockResponse.loose.toString());
  });
});

// Exemple de tests pour les autres fonctions (validatePwd, updatePwd, deleteProfil, etc.)
describe('Autres fonctions', () => {
  // ...
});

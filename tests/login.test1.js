// Import des modules nécessaires pour les tests
const { JSDOM } = require('jsdom');
const login = require('../public/js/login');

// Déclaration d'une fonction utilitaire pour simuler un événement
function simulateEvent(element, eventType) {
  const event = new element.ownerDocument.defaultView.Event(eventType);
  element.dispatchEvent(event);
}

// Test de la fonction verification_password
describe('verification_password', () => {
  let document;

  beforeEach(() => {
    // Création d'un contexte DOM avec JSDOM
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <input id="pass1" type="password" value="password1">
          <input id="pass2" type="password" value="password2">
        </body>
      </html>
    `);

    document = dom.window.document;
  });

  it('should remove "required" attribute and clear custom validity for "signin" type', () => {
    // Simuler l'appel à verification_password avec le type "signin"
    const type = 'signin';
    login.verification_password(type);

    // Vérifier que l'attribut "required" a été supprimé
    expect(document.getElementById('pass2').hasAttribute('required')).toBeFalsy();

    // Vérifier que la validité personnalisée a été effacée
    expect(document.getElementById('pass2').validationMessage).toBe('');
  });

  it('should set "required" attribute and set custom validity for "signup" type', () => {
    // Simuler l'appel à verification_password avec le type "signup"
    const type = 'signup';
    verification_password(type);

    // Vérifier que l'attribut "required" a été ajouté
    expect(document.getElementById('pass2').hasAttribute('required')).toBeTruthy();

    // Vérifier que la validité personnalisée a été définie
    expect(document.getElementById('pass2').validationMessage).toBe('Les mots de passe ne sont pas identiques !');
  });
});

// Test de la fonction change_button
describe('change_button', () => {
  let document;

  beforeEach(() => {
    // Création d'un contexte DOM avec JSDOM
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <button id="signin" type="button"></button>
          <button id="signup" type="button"></button>
        </body>
      </html>
    `);

    document = dom.window.document;
  });

  it('should change button types for "signin" type', () => {
    // Simuler l'appel à change_button avec le type "signin"
    const type = 'signin';
    change_button(type);

    // Vérifier que le type du bouton "signin" a été modifié en "submit"
    expect(document.getElementById('signin').getAttribute('type')).toBe('submit');

    // Vérifier que le type du bouton "signup" est toujours "button"
    expect(document.getElementById('signup').getAttribute('type')).toBe('button');
  });

  it('should change button types for "signup" type', () => {
    // Simuler l'appel à change_button avec le type "signup"
    const type = 'signup';
    change_button(type);

    // Vérifier que le type du bouton "signup" a été modifié en "submit"
    expect(document.getElementById('signup').getAttribute('type')).toBe('submit');

    // Vérifier que le type du bouton "signin" est toujours "button"
    expect(document.getElementById('signin').getAttribute('type')).toBe('button');
  });
});

// Test de la fonction submitLoginForm
describe('submitLoginForm', () => {
  let document;
  let fetchMock;
  let responseMock;

  beforeEach(() => {
    // Création d'un contexte DOM avec JSDOM
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <form name="login-form">
            <input name="email" type="text" value="test@example.com">
            <input name="pass" type="password" value="password">
            <button id="signin" type="button">Sign In</button>
            <button id="signup" type="button">Sign Up</button>
          </form>
          <small id="message-help"></small>
        </body>
      </html>
    `);

    document = dom.window.document;

    // Mock de la fonction fetch
    responseMock = { error: null, message: 'Success' };
    fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseMock)
    });

    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a POST request to /api/users/login for "signin" type', async () => {
    // Simuler l'appel à submitLoginForm avec le type "signin"
    const event = new document.defaultView.Event('submit');
    simulateEvent(document.querySelector('form[name="login-form"]'), 'submit');
    await submitLoginForm(event);

    // Vérifier que fetch a été appelé avec les bons paramètres
    expect(fetchMock).toHaveBeenCalledWith('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', pass: 'password' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Vérifier que la redirection s'est produite en cas de succès
    expect(document.defaultView.location.href).toBe('/api/users/profil');
  });

  it('should make a POST request to /api/users/signup for "signup" type', async () => {
    // Simuler l'appel à submitLoginForm avec le type "signup"
    const event = new document.defaultView.Event('submit');
    document.getElementById('signup').setAttribute('type', 'submit');
    simulateEvent(document.querySelector('form[name="login-form"]'), 'submit');
    await submitLoginForm(event);

    // Vérifier que fetch a été appelé avec les bons paramètres
    expect(fetchMock).toHaveBeenCalledWith('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', pass: 'password' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Vérifier que le message d'erreur a été affiché en cas d'erreur
    expect(document.getElementById('message-help').textContent).toBe('Success Vous pouvez vous connecter');
  });
});

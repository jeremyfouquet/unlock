/****************************************************************************
  Nom ......... : login.test.js
  Rôle ........ : tests unitaires du fichier login.js
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

// charge le fichier HTML
const fs = require('fs');
const html = fs.readFileSync('./views/login.html', 'utf-8');

// crée un environnement DOM simulé avec JSDOM avec exécution de scripts
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html, { runScripts: 'dangerously' });
const { window } = dom;

// expose les objets globaux du DOM simulé dans l'environnement de test
global.document = window.document;
global.window = window;

const login = require('./public/js/login'); // importe les fonctions à tester

describe('verification_password', () => {

  // réinitialise les valeurs des champs de mot de passe avant chaque test
  beforeEach(() => {    
    let pass1 = document.getElementById('pass1');
    let pass2 = document.getElementById('pass2');
    pass1.value = '';
    pass2.value = '';
  });
  
  it('Doit retirer l\'attribut obligatoire de la confirmation du mot de passe à taper pour le type "signin"', () => {
    login.verification_password('signin');
    pass2 = document.getElementById('pass2');

    expect(pass2.hasAttribute('required')).toBe(false);
    expect(pass2.validationMessage).toBe('');
  });

  it('Doit mettre l\'attribut obligatoire de la confirmation du mot de passe à taper pour le type "signup" puis valider les mots de passe identiques tapés', () => {
    pass1 = document.getElementById('pass1');
    pass2 = document.getElementById('pass2');
    pass1.value = 'password';
    pass2.value = 'password';
    login.verification_password('signup');
    pass2 = document.getElementById('pass2');

    expect(pass2.hasAttribute('required')).toBe(true);
    expect(pass2.validationMessage).toBe('');
  });

  it('Doit mettre l\'attribut obligatoire de la confirmation du mot de passe à taper pour le type "signup" puis invalider les mots de passe différents tapés', () => {
    pass1 = document.getElementById('pass1');
    pass2 = document.getElementById('pass2');
    pass1.value = 'password1';
    pass2.value = 'password2';
    login.verification_password('signup');
    pass2 = document.getElementById('pass2');

    expect(pass2.hasAttribute('required')).toBe(true);
    expect(pass2.validationMessage).toBe("Les mots de passe ne sont pas identiques !");
  });

});

describe('change_button', () => {

  it('Doit mettre le bouton \'signin\' dans le type submit et le bouton \'signup\' dans le type button', () => {
    login.change_button('signin');
    const btnSignin = document.getElementById('signin');
    const btnSignup = document.getElementById('signup');

    expect(btnSignin.getAttribute('type')).toBe('submit');
    expect(btnSignup.getAttribute('type')).toBe('button');
  });

  it('Doit mettre le bouton \'signin\' dans le type button et le bouton \'signup\' dans le type submit', () => {
    login.change_button('signup');
    const btnSignin = document.getElementById('signin');
    const btnSignup = document.getElementById('signup');

    expect(btnSignin.getAttribute('type')).toBe('button');
    expect(btnSignup.getAttribute('type')).toBe('submit');
  });

});

describe('inscription', () => {

  it('Doit mettre le bouton \'signin\' dans le type submit, le bouton \'signup\' dans le type button et la confirmation de mot de passe obligatoire', () => {
    login.inscription();
    const btnSignin = document.getElementById('signin');
    const btnSignup = document.getElementById('signup');
    const pass2 = document.getElementById('pass2');

    expect(btnSignin.getAttribute('type')).toBe('button');
    expect(btnSignup.getAttribute('type')).toBe('submit');
    expect(pass2.hasAttribute('required')).toBe(true);
  });

});

describe('login', () => {

  it('Doit mettre le bouton \'signin\' dans le type button, le bouton \'signup\' dans le type submit et retirer la confirmation de mot de passe obligatoire', () => {
    login.login();
    const btnSignin = document.getElementById('signin');
    const btnSignup = document.getElementById('signup');
    const pass2 = document.getElementById('pass2');

    expect(btnSignin.getAttribute('type')).toBe('submit');
    expect(btnSignup.getAttribute('type')).toBe('button');
    expect(pass2.hasAttribute('required')).toBe(false);
  });
  
});
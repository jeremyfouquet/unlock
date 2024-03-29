/****************************************************************************
  Nom ......... : routes-controllers-users.test.js
  Rôle ........ : tests d'intégrations des routes users
  Auteur ...... : Georges Miot
  Version ..... : V1.0 du 02/06/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Utilisation de tokens hashés
const mongoose = require('mongoose');

describe('Test des users routes', () => {
  const email = 'test@example.com';
  const pswd = 'password123';
  let cookie;
  let jeton;

  // attente du chargement de mongoose et suppression de tous les utilisateurs
  beforeAll((done) => {
    setTimeout(() => {

      // supprime tous les utilisateurs
      User.deleteMany({})
        .then(() => {
          console.log('Tous les utilisateurs ont été supprimés avec succès.');
        })
        .catch((err) => {
          console.error('Erreur lors de la suppression des utilisateurs :', err);
        });
    
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });

  it('Doit renvoyer la page de connexion/inscription', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Connexion / Inscription');
  });

  it('Doit créer une nouvel utilisateur', async () => {
    const response = await request(app).post('/api/users/signup').send({
      email: email,
      pass: pswd,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur créé !');
  });
  
  it('Doit authentifier un utlisateur et renvoyer un cookie', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: email,
      pass: pswd,
    });
    
    // récupère le cookie et le jeton
    cookie = response.headers['set-cookie'];
    const cookieArray = cookie[0].split(';');
    let access_token = cookieArray[0];
    accessToken = access_token.substring('access_token='.length);  
    jeton = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    
    expect(response.status).toBe(200);
    expect(cookie).toBeDefined();
    expect(response.text).toContain('Utilisateur connecté !');
  });
  
  it('Doit récupérer les informations de l\'utilisateur authentifié', async () => {
    const response = await request(app).get('/api/users/me').set('Cookie', cookie);
    
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
    expect(response.body.win).toBeDefined();
    expect(response.body.loose).toBeDefined();
  });
  
  it('Doit renvoyer la page du profil de l\'utilisateur authentifié', async () => {
    const response = await request(app).get('/api/users/profil').set('Cookie', cookie);
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('Mon profil');
  });
  
  it('Doit incrémenter le nombre de victoires de l\'utilisateur authentifié', async () => {
    const response = await request(app).put('/api/users/incrementWin').set('Cookie', cookie);

    expect(response.status).toBe(200);
  });

  it('Attente mise à jour du nombre de victoires...', (done) => {
    setTimeout(() => {
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
  
  it('Vérifie l\'incrémentation du nombre de victoires de l\'utilisateur authentifié', async () => {
    id = await User.findById({_id: jeton.userId});

    expect(id.win).toBe(1);
  });

  it('Doit incrémenter le nombre de défaites de l\'utilisateur authentifié', async () => {
    const response = await request(app).put('/api/users/incrementLoose').set('Cookie', cookie);

    expect(response.status).toBe(200);
  });
  
  it('Attente mise à jour du nombre de défaites...', (done) => {
    setTimeout(() => {
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
  
  it('Vérifie l\'incrémentation du nombre de défaites de l\'utilisateur authentifié', async () => {
    id = await User.findById({_id: jeton.userId});

    expect(id.loose).toBe(1);
  });

  it('Doit mettre à jour un mot de passe', async() => {
    const response = await request(app).put('/api/users/updatePSWD').send({pass: 'newpassword123'}).set('Cookie', cookie);
    
    expect(response.status).toBe(200);
  });
  
  it('Attente mise à jour du mot de passe...', (done) => {
    setTimeout(() => {
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
  
  it('Doit se connecter avec le nouveau mot de passe', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: email,
      pass: 'newpassword123',
    });

    expect(response.status).toBe(200);
  });

  it('Doit supprimer le cookie d\'authentification puis déconnexion', async () => {
    const response = await request(app).post('/api/users/logout');

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toBe('access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(response.text).toContain('Utilisateur déconnecté !');
  });

  it('Doit authentifier un utlisateur avec un mot de passe faux et renvoyer un message d\'erreur', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: email,
      pass: 'fakePassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('E-mail et/ou Mot de passe incorrect !');
  });

  it('Doit supprimer le compte utilisateur', async () => {
    const response = await request(app).delete('/api/users/delete').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Utilisateur supprimé !');
  });
  
  it('Doit récupérer les informations d\'un utilisateur GUEST', async () => {
    const response = await request(app).get('/api/users/me');
    
    expect(response.status).toBe(400);
    expect(response.body.email).toBe('GUEST');
    expect(response.body.win).toBeDefined();
    expect(response.body.loose).toBeDefined();
  });
  
  it('Doit renvoyer la page de login pour un profil utilisateur non authentifié', async () => {
    const response = await request(app).get('/api/users/profil');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('Connexion / Inscription');
  });

  it('Doit authentifier un utlisateur inconnu et renvoyer un message d\'erreur', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: email,
      pass: 'password123',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('E-mail et/ou Mot de passe incorrect !');
  });
  
  afterAll(() => {
    mongoose.disconnect();
  });
  
});
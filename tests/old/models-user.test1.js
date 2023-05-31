/*
const uniqueValidator = require('mongoose-unique-validator');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Attente du chargement de app.js', () => {
  it('Déconnexion de mongoose', (done) => {
    setTimeout(() => {
      //mongoose.disconnect();
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
});
*/
/*
// Connexion à la base de données avant les tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
*/
/*
// Nettoyage de la base de données après les tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Model', () => {
  // Test de la validation de l'unicité de l'email
  it('should validate unique email', async () => {
    const user1 = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    await user1.save();

    const user2 = new User({
      email: 'test@example.com',
      password: 'password456',
    });

    try {
      await user2.save();
    } catch (error) {
      expect(error.message).toContain('email must be unique');
    }
  });

  // Autres tests pour le modèle User
  // ...

});
*/


const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Attente du chargement de app.js', () => {
  it('Déconnexion de mongoose', (done) => {
    setTimeout(() => {
      //mongoose.disconnect();
      done();
    }, 3000); // attendre 3 secondes (ajuster si nécessaire)
  });
});

describe('User Model', () => {
  afterAll(async () => {
    // Fermer la connexion à la base de données MongoDB
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Supprimer tous les documents de la collection User avant chaque test
    await User.deleteMany();
  });

  it('should increment win count', async () => {
    // Créer un nouvel utilisateur
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      win: 5,
      loose: 3,
    });

    // Appeler la méthode pour incrémenter le compteur de victoires
    await User.incrementWin(user._id);

    // Obtenir le document utilisateur mis à jour depuis la base de données
    const updatedUser = await User.findOne({ _id: user._id });

    // Vérifier si le compteur de victoires a été incrémenté
    expect(updatedUser.win).toBe(user.win + 1);
  });
  
  it('should increment loose count', async () => {
    // Créer un nouvel utilisateur
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      win: 5,
      loose: 3,
    });

    // Appeler la méthode pour incrémenter le compteur de défaites
    await User.incrementLoose(user._id);

    // Obtenir le document utilisateur mis à jour depuis la base de données
    const updatedUser = await User.findOne({ _id: user._id });

    // Vérifier si le compteur de défaites a été incrémenté
    expect(updatedUser.loose).toBe(user.loose + 1);
  });
});

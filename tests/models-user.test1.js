const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('../models/user');

// Connexion à la base de données avant les tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

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

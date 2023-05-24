const request = require('supertest');
const server = require('../server');
const app = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Mocks
jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Tests des contrôleurs utilisateur', () => {
  /*
  // Test pour la méthode getPage
  it('GET /api/user devrait renvoyer la page utilisateur', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });
  */
 
  // Test pour la méthode signup
  it('POST /api/user/signup devrait créer un nouvel utilisateur', async () => {
    const mockHashedPassword = 'mockHashedPassword';
    bcrypt.hash.mockResolvedValue(mockHashedPassword);

    const mockUser = {
      save: jest.fn().mockResolvedValue()
    };
    User.mockReturnValueOnce(mockUser);

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@example.com', pass: 'password' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur créé !');
    expect(User).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: mockHashedPassword,
      win: 0,
      loose: 0
    });
    expect(mockUser.save).toHaveBeenCalled();
  });

  // Test pour la méthode login
  it('POST /api/users/login devrait connecter un utilisateur existant', async () => {
    const mockUser = {
      _id: 'mockUserId',
      password: 'mockHashedPassword'
    };
    User.findOne.mockResolvedValue(mockUser);

    const mockValidPassword = true;
    bcrypt.compare.mockResolvedValue(mockValidPassword);

    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', pass: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(mockUser._id);
    expect(response.body.token).toBe(mockToken);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '3h' }
    );
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });

  // Test pour la méthode logout
  it('POST /api/user/logout devrait déconnecter l\'utilisateur', async () => {
    const response = await request(app).post('/api/users/logout');
    expect(response.status).toBe(200);
    // Ajoutez ici les assertions supplémentaires pour vérifier la réponse attendue
  });

  afterAll(() => {
    server.close();
  });

});

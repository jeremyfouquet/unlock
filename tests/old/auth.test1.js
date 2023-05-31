const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

describe('auth', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should add userId to req.auth if token is valid', () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = {
      userId: 'mockUserId',
    };

    // Configurer le spy avant d'appeler auth(req, res, next)
    jest.spyOn(jwt, 'verify').mockReturnValue(mockDecodedToken);
    req.cookies = {
      access_token: mockToken,
    };

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET_KEY);
    expect(req.auth).toEqual({ userId: mockDecodedToken.userId });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should send 401 error if token is invalid', () => {
    // Configurer le spy avant d'appeler auth(req, res, next)
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(req.auth).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Veuillez vous reconnecter');
  });
});

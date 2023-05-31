const { getUniqueId } = require('../middlewares/helper');

describe('getUniqueId', () => {
  it('should return unique ID when users array is not empty', () => {
    const users = [
      { _id: 1 },
      { _id: 3 },
      { _id: 2 },
    ];
    const expectedId = 4;
    const result = getUniqueId(users);
    expect(result).toBe(expectedId);
  });

  it('should return 1 when users array is empty', () => {
    const users = [];
    const expectedId = 1;
    const result = getUniqueId(users);
    expect(result).toBe(expectedId);
  });
});

const Clue = require('../public/js/clue');

describe('Clue', () => {
    let clue;

    beforeEach(() => {
      clue = new Clue(1, 'Clue Name', 'Clue Description', 'clue.jpg', 3, false, 'type');
    });
    
    it('should have the correct properties', () => {
      expect(clue.id).toBe(1);
      expect(clue.name).toBe('Clue Name');
      expect(clue.description).toBe('Clue Description');
      expect(clue.img).toBe('clue.jpg');
      expect(clue.numsClues).toBe(3);
      expect(clue.discard).toBe(false);
      expect(clue.type).toBe('type');
      expect(clue.combinable).toEqual({});
      expect(clue.machine).toEqual({});
    });
  
    it('should set combinable property correctly', () => {
      const combinableObj = { prop: 'value' };
      clue.setCombinable(combinableObj);
      expect(clue.combinable).toEqual(combinableObj);
    });
    
    it('should set machine property correctly', () => {
      const machineObj = { prop: 'value' };
      clue.setMachine(machineObj);
      expect(clue.machine).toEqual(machineObj);
    });
  });
  
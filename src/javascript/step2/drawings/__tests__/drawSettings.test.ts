import { getType } from '../drawSettings';

describe('drawSettings utilities', () => {
  describe('getType', () => {
    it('should return "number" for settings with max property', () => {
      const setting = { min: 0, max: 100, value: 50 };
      expect(getType(setting)).toBe('number');
    });

    it('should return "select" for settings with list property', () => {
      const setting = { list: ['option1', 'option2'], value: 'option1' };
      expect(getType(setting)).toBe('select');
    });

    it('should return "checkbox" for settings with checked property', () => {
      const setting = { checked: true };
      expect(getType(setting)).toBe('checkbox');
    });

    it('should return "color" for settings with value property and no other indicators', () => {
      const setting = { value: '#ff0000', icon: 'fa-palette' };
      expect(getType(setting)).toBe('color');
    });

    it('should return "color" as default when no other type matches', () => {
      const setting = { icon: 'fa-something' };
      expect(getType(setting)).toBe('color');
    });

    it('should prioritize max over list', () => {
      const setting = { max: 100, list: ['a', 'b'] };
      expect(getType(setting)).toBe('number');
    });

    it('should prioritize list over checked', () => {
      const setting = { list: ['a', 'b'], checked: true };
      expect(getType(setting)).toBe('select');
    });

    it('should prioritize checked over default color', () => {
      const setting = { checked: false, value: '#000' };
      expect(getType(setting)).toBe('checkbox');
    });
  });
});

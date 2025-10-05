import { normalizeValue, getAverageValue, getIndexFromValue, getPercentage } from '../math';

describe('math utilities', () => {
  describe('normalizeValue', () => {
    it('should normalize 255 to 1', () => {
      expect(normalizeValue(255)).toBe(1);
    });

    it('should normalize 0 to 0', () => {
      expect(normalizeValue(0)).toBe(0);
    });

    it('should normalize 127.5 to 0.5', () => {
      expect(normalizeValue(127.5)).toBeCloseTo(0.5, 5);
    });

    it('should normalize 51 to ~0.2', () => {
      expect(normalizeValue(51)).toBeCloseTo(0.2, 1);
    });
  });

  describe('getAverageValue', () => {
    it('should calculate average of array', () => {
      const arr = [10, 20, 30, 40, 50];
      expect(getAverageValue(arr)).toBe(30);
    });

    it('should handle single element array', () => {
      expect(getAverageValue([42])).toBe(42);
    });

    it('should handle array with zeros', () => {
      expect(getAverageValue([0, 0, 0])).toBe(0);
    });

    it('should handle decimal values', () => {
      const arr = [1.5, 2.5, 3.5];
      expect(getAverageValue(arr)).toBeCloseTo(2.5, 5);
    });

    it('should handle empty array gracefully', () => {
      const result = getAverageValue([]);
      expect(isNaN(result)).toBe(true);
    });
  });

  describe('getIndexFromValue', () => {
    it('should calculate index from value', () => {
      const result = getIndexFromValue(100, 127);
      expect(result).toBe(100);
    });

    it('should handle value of 0', () => {
      const result = getIndexFromValue(100, 0);
      expect(result).toBe(0);
    });

    it('should handle mid-range value', () => {
      const result = getIndexFromValue(100, 64);
      expect(result).toBeCloseTo(50, 0);
    });

    it('should scale with array length', () => {
      expect(getIndexFromValue(50, 127)).toBe(50);
      expect(getIndexFromValue(200, 127)).toBe(200);
    });
  });

  describe('getPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(getPercentage(100, 50)).toBe(50);
    });

    it('should handle 0 value', () => {
      expect(getPercentage(100, 0)).toBe(0);
    });

    it('should handle value equal to length', () => {
      expect(getPercentage(100, 100)).toBe(100);
    });

    it('should calculate fractional percentages', () => {
      expect(getPercentage(100, 25)).toBe(25);
      expect(getPercentage(100, 75)).toBe(75);
    });

    it('should handle small arrays', () => {
      expect(getPercentage(4, 2)).toBe(50);
    });
  });
});

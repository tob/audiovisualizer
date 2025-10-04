import { inRange, circlePos, getPatternXy } from '../shapes';

describe('shapes utilities', () => {
  describe('inRange', () => {
    it('should return true when value is within range', () => {
      expect(inRange(5, 0, 10)).toBe(true);
    });

    it('should return true when value equals min', () => {
      expect(inRange(0, 0, 10)).toBe(true);
    });

    it('should return true when value equals max', () => {
      expect(inRange(10, 0, 10)).toBe(true);
    });

    it('should return false when value is below range', () => {
      expect(inRange(-1, 0, 10)).toBe(false);
    });

    it('should return false when value is above range', () => {
      expect(inRange(11, 0, 10)).toBe(false);
    });

    it('should handle default min of 0', () => {
      expect(inRange(5, undefined, 10)).toBe(true);
      expect(inRange(-1, undefined, 10)).toBe(false);
    });

    it('should handle negative ranges', () => {
      expect(inRange(-5, -10, 0)).toBe(true);
      expect(inRange(-11, -10, 0)).toBe(false);
    });
  });

  describe('circlePos', () => {
    it('should calculate position on circle at i=0 (-90 degrees)', () => {
      const result = circlePos(100, 0);
      // At i=0: angle = (360/60) * (0-15) = -90 degrees
      // cos(-90°) ≈ 0, sin(-90°) = -1
      expect(result.width).toBeCloseTo(0, 1);
      expect(result.height).toBeCloseTo(-100, 1);
    });

    it('should calculate position at i=15 (0 degrees)', () => {
      const result = circlePos(100, 15); // 15 = 0 degrees in the formula
      // At i=15: angle = (360/60) * (15-15) = 0 degrees
      // cos(0°) = 1, sin(0°) = 0
      expect(result.width).toBeCloseTo(100, 1);
      expect(result.height).toBeCloseTo(0, 1);
    });

    it('should handle radius of 0', () => {
      const result = circlePos(0, 10);
      expect(result.width).toBeCloseTo(0, 1);
      expect(result.height).toBeCloseTo(0, 1);
    });

    it('should return object with width and height properties', () => {
      const result = circlePos(50, 5);
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(typeof result.width).toBe('number');
      expect(typeof result.height).toBe('number');
    });
  });

  describe('getPatternXy', () => {
    const mockCanvas = {
      width: 800,
      height: 600,
    };

    describe('center mode', () => {
      it('should return center of canvas', () => {
        const result = getPatternXy({
          canvas: mockCanvas as any,
          radius: 100,
          volume: 50,
          width: 10,
          size: 5,
          i: 0,
          mode: 'center',
          arrayLength: 10,
          asset: '',
        });

        expect(result.x).toBe(400);
        expect(result.y).toBe(300);
      });
    });

    describe('circle mode', () => {
      it('should return position on circle', () => {
        const result = getPatternXy({
          canvas: mockCanvas as any,
          radius: 100,
          volume: 50,
          width: 10,
          size: 5,
          i: 0,
          mode: 'circle',
          arrayLength: 10,
          asset: '',
        });

        // Position should be offset from center
        expect(result.x).toBeGreaterThan(400);
        expect(result.y).toBeCloseTo(300, 0);
      });

      it('should distribute points around circle', () => {
        const positions = [];
        const arrayLength = 8;

        for (let i = 0; i < arrayLength; i++) {
          const result = getPatternXy({
            canvas: mockCanvas as any,
            radius: 100,
            volume: 50,
            width: 10,
            size: 5,
            i,
            mode: 'circle',
            arrayLength,
            asset: '',
          });
          positions.push(result);
        }

        // All positions should be different
        const uniqueX = new Set(positions.map(p => Math.round(p.x)));
        const uniqueY = new Set(positions.map(p => Math.round(p.y)));
        expect(uniqueX.size).toBeGreaterThan(1);
        expect(uniqueY.size).toBeGreaterThan(1);
      });
    });

    describe('line mode', () => {
      it('should return horizontal positions', () => {
        const result1 = getPatternXy({
          canvas: mockCanvas as any,
          radius: 100,
          volume: 50,
          width: 10,
          size: 5,
          i: 0,
          mode: 'line',
          arrayLength: 10,
          asset: '',
        });

        const result2 = getPatternXy({
          canvas: mockCanvas as any,
          radius: 100,
          volume: 50,
          width: 10,
          size: 5,
          i: 5,
          mode: 'line',
          arrayLength: 10,
          asset: '',
        });

        // Y should be constant (center)
        expect(result1.y).toBe(300);
        expect(result2.y).toBe(300);

        // X should increase
        expect(result2.x).toBeGreaterThan(result1.x);
      });
    });

    describe('wave mode', () => {
      it('should create wave pattern', () => {
        const positions = [];
        const arrayLength = 20;

        for (let i = 0; i < arrayLength; i++) {
          const result = getPatternXy({
            canvas: mockCanvas as any,
            radius: 100,
            volume: 50,
            width: 10,
            size: 5,
            i,
            mode: 'wave',
            arrayLength,
            asset: '',
          });
          positions.push(result);
        }

        // Y values should vary (creating wave)
        const yValues = positions.map(p => p.y);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        expect(maxY - minY).toBeGreaterThan(50);
      });
    });

    describe('grid mode', () => {
      it('should create grid positions', () => {
        const result = getPatternXy({
          canvas: mockCanvas as any,
          radius: 100,
          volume: 50,
          width: 10,
          size: 5,
          i: 0,
          mode: 'grid',
          arrayLength: 16,
          asset: '',
        });

        expect(result.x).toBeGreaterThan(0);
        expect(result.y).toBeGreaterThan(0);
        expect(result.x).toBeLessThan(mockCanvas.width);
        expect(result.y).toBeLessThan(mockCanvas.height);
      });
    });
  });
});

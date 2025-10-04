import { RANGES, settings } from '../layer-settings';

describe('layer-settings', () => {
  describe('settings object', () => {
    it('should have all required setting properties', () => {
      expect(settings).toHaveProperty('range');
      expect(settings).toHaveProperty('slices');
      expect(settings).toHaveProperty('pattern');
      expect(settings).toHaveProperty('shape');
      expect(settings).toHaveProperty('size');
      expect(settings).toHaveProperty('stroke');
      expect(settings).toHaveProperty('fillMode');
      expect(settings).toHaveProperty('color');
      expect(settings).toHaveProperty('opacity');
      expect(settings).toHaveProperty('effect');
      expect(settings).toHaveProperty('twist');
      expect(settings).toHaveProperty('rotationSpeed');
    });

    it('should have valid range options', () => {
      expect(settings.range.list).toContain('sub bass');
      expect(settings.range.list).toContain('low bass');
      expect(settings.range.list).toContain('bass');
      expect(settings.range.list).toContain('low mid');
      expect(settings.range.list).toContain('mid');
      expect(settings.range.list).toContain('high mid');
      expect(settings.range.list).toContain('all');
      expect(settings.range.value).toBe('all');
    });

    it('should have valid pattern options', () => {
      expect(settings.pattern.list).toContain('center');
      expect(settings.pattern.list).toContain('line');
      expect(settings.pattern.list).toContain('circle');
      expect(settings.pattern.list).toContain('spiral');
      expect(settings.pattern.list).toContain('wave');
      expect(settings.pattern.list).toContain('grid');
      expect(settings.pattern.list).toContain('random');
    });

    it('should have valid shape options', () => {
      expect(settings.shape.list).toContain('triangle');
      expect(settings.shape.list).toContain('square');
      expect(settings.shape.list).toContain('circle');
      expect(settings.shape.list).toContain('star');
      expect(settings.shape.list).toContain('ninja');
    });

    it('should have valid fillMode options', () => {
      expect(settings.fillMode.list).toEqual(['color', 'video']);
      expect(settings.fillMode.value).toBe('color');
    });

    it('should have valid numeric ranges', () => {
      expect(settings.size.min).toBe(0);
      expect(settings.size.max).toBe(15);
      expect(settings.opacity.min).toBe(0);
      expect(settings.opacity.max).toBe(100);
      expect(settings.rotationSpeed.min).toBe(-10);
      expect(settings.rotationSpeed.max).toBe(10);
    });
  });

  describe('RANGES object', () => {
    it('should have all frequency ranges', () => {
      expect(RANGES).toHaveProperty('sub bass');
      expect(RANGES).toHaveProperty('low bass');
      expect(RANGES).toHaveProperty('bass');
      expect(RANGES).toHaveProperty('low mid');
      expect(RANGES).toHaveProperty('mid');
      expect(RANGES).toHaveProperty('high mid');
      expect(RANGES).toHaveProperty('all');
    });

    it('should have valid range values (min < max)', () => {
      Object.entries(RANGES).forEach(([name, range]) => {
        expect(range.min).toBeLessThanOrEqual(range.max);
        expect(range.min).toBeGreaterThanOrEqual(0);
        expect(range.max).toBeLessThanOrEqual(1);
      });
    });

    it('should have sub bass at the lowest frequencies', () => {
      expect(RANGES['sub bass'].min).toBe(0);
      expect(RANGES['sub bass'].max).toBeLessThan(0.1);
    });

    it('should have all range covering full spectrum', () => {
      expect(RANGES.all.min).toBe(0);
      expect(RANGES.all.max).toBe(1);
    });

    it('should have non-overlapping adjacent ranges', () => {
      const rangeKeys = ['sub bass', 'low bass', 'bass', 'low mid', 'mid', 'high mid'];

      for (let i = 0; i < rangeKeys.length - 1; i++) {
        const currentRange = RANGES[rangeKeys[i]];
        const nextRange = RANGES[rangeKeys[i + 1]];

        // Next range should start where current range ends (or very close)
        expect(currentRange.max).toBeCloseTo(nextRange.min, 2);
      }
    });

    it('should focus on lower 50% of spectrum (where audio lives)', () => {
      // high mid should end at or before 50%
      expect(RANGES['high mid'].max).toBeLessThanOrEqual(0.5);
    });
  });
});

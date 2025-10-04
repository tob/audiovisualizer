import { rotate, updateAngles } from '../transform';

describe('transform utilities', () => {
  describe('rotate', () => {
    let mockCtx: any;
    let drawFn: jest.Mock;

    beforeEach(() => {
      mockCtx = {
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
      };
      drawFn = jest.fn();
    });

    it('should not rotate when degree is 0', () => {
      rotate({ ctx: mockCtx, x: 100, y: 100, draw: drawFn, degree: 0 });

      expect(mockCtx.save).not.toHaveBeenCalled();
      expect(mockCtx.restore).not.toHaveBeenCalled();
      expect(mockCtx.translate).not.toHaveBeenCalled();
      expect(mockCtx.rotate).not.toHaveBeenCalled();
      expect(drawFn).toHaveBeenCalledWith(100, 100);
    });

    it('should not rotate when degree is 360', () => {
      rotate({ ctx: mockCtx, x: 100, y: 100, draw: drawFn, degree: 360 });

      expect(mockCtx.save).not.toHaveBeenCalled();
      expect(mockCtx.restore).not.toHaveBeenCalled();
      expect(drawFn).not.toHaveBeenCalled();
    });

    it('should not rotate when degree is -360', () => {
      rotate({ ctx: mockCtx, x: 100, y: 100, draw: drawFn, degree: -360 });

      expect(mockCtx.save).not.toHaveBeenCalled();
      expect(mockCtx.restore).not.toHaveBeenCalled();
      expect(drawFn).not.toHaveBeenCalled();
    });

    it('should rotate when degree is non-zero and less than 360', () => {
      rotate({ ctx: mockCtx, x: 100, y: 100, draw: drawFn, degree: 45 });

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.translate).toHaveBeenCalledWith(100, 100);
      expect(mockCtx.rotate).toHaveBeenCalledWith(45);
      expect(mockCtx.translate).toHaveBeenCalledWith(-100, -100);
      expect(drawFn).toHaveBeenCalledWith(100, 100);
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should handle negative degrees', () => {
      rotate({ ctx: mockCtx, x: 50, y: 50, draw: drawFn, degree: -90 });

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.translate).toHaveBeenCalledWith(50, 50);
      expect(mockCtx.rotate).toHaveBeenCalledWith(-90);
      expect(mockCtx.translate).toHaveBeenCalledWith(-50, -50);
      expect(drawFn).toHaveBeenCalledWith(50, 50);
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should call save and restore in correct order', () => {
      const callOrder: string[] = [];
      mockCtx.save = jest.fn(() => callOrder.push('save'));
      mockCtx.restore = jest.fn(() => callOrder.push('restore'));
      drawFn = jest.fn(() => callOrder.push('draw'));

      rotate({ ctx: mockCtx, x: 0, y: 0, draw: drawFn, degree: 10 });

      expect(callOrder).toEqual(['save', 'draw', 'restore']);
    });
  });

  describe('updateAngles', () => {
    it('should increase angle based on rotation speed and average', () => {
      const result = updateAngles({
        angles: 0,
        prevAverage: 100,
        rotationSpeed: 5,
      });

      expect(result).toBe(0.05);
    });

    it('should reset to 0 when angle reaches 360', () => {
      const result = updateAngles({
        angles: 360,
        prevAverage: 100,
        rotationSpeed: 5,
      });

      expect(result).toBe(0);
    });

    it('should handle angle just below 360', () => {
      const result = updateAngles({
        angles: 359.99,
        prevAverage: 100,
        rotationSpeed: 5,
      });

      expect(result).toBeCloseTo(360.04, 2);
    });

    it('should handle zero rotation speed', () => {
      const result = updateAngles({
        angles: 45,
        prevAverage: 100,
        rotationSpeed: 0,
      });

      expect(result).toBe(45);
    });

    it('should handle zero average', () => {
      const result = updateAngles({
        angles: 45,
        prevAverage: 0,
        rotationSpeed: 5,
      });

      expect(result).toBe(45);
    });

    it('should accumulate angles over multiple calls', () => {
      let angle = 0;

      angle = updateAngles({ angles: angle, prevAverage: 100, rotationSpeed: 5 });
      expect(angle).toBeCloseTo(0.05, 5);

      angle = updateAngles({ angles: angle, prevAverage: 100, rotationSpeed: 5 });
      expect(angle).toBeCloseTo(0.1, 5);

      angle = updateAngles({ angles: angle, prevAverage: 100, rotationSpeed: 5 });
      expect(angle).toBeCloseTo(0.15, 5);
    });

    it('should handle negative rotation speed', () => {
      const result = updateAngles({
        angles: 45,
        prevAverage: 100,
        rotationSpeed: -5,
      });

      expect(result).toBeCloseTo(44.95, 5);
    });
  });
});

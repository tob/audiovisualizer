import { hexToRGB, rgbToHex } from '../colors';

describe('colors utilities', () => {
  describe('hexToRGB', () => {
    it('should convert hex color to RGB object', () => {
      const result = hexToRGB(0xff0f22);
      expect(result).toEqual({
        r: 255,
        g: 15,
        b: 34,
      });
    });

    it('should handle black color', () => {
      const result = hexToRGB(0x000000);
      expect(result).toEqual({
        r: 0,
        g: 0,
        b: 0,
      });
    });

    it('should handle white color', () => {
      const result = hexToRGB(0xffffff);
      expect(result).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
    });

    it('should handle mid-range colors', () => {
      const result = hexToRGB(0x7f7f7f);
      expect(result).toEqual({
        r: 127,
        g: 127,
        b: 127,
      });
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB values to hex string', () => {
      const result = rgbToHex(255, 15, 34);
      expect(result).toBe('#ff0f22');
    });

    it('should handle black color', () => {
      const result = rgbToHex(0, 0, 0);
      expect(result).toBe('#000000');
    });

    it('should handle white color', () => {
      const result = rgbToHex(255, 255, 255);
      expect(result).toBe('#ffffff');
    });

    it('should pad single digit hex values with zero', () => {
      const result = rgbToHex(1, 2, 3);
      expect(result).toBe('#010203');
    });

    it('should handle mid-range colors', () => {
      const result = rgbToHex(127, 127, 127);
      expect(result).toBe('#7f7f7f');
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain color through hex -> RGB -> hex conversion', () => {
      const rgb = hexToRGB(0xaabbcc);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      expect(hex).toBe('#aabbcc');
    });
  });
});

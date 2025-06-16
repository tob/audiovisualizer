export function hexToRGB(hexColor) {
  return {
    r: (hexColor >> 16) & 0xff,
    g: (hexColor >> 8) & 0xff,
    b: hexColor & 0xff,
  };
}

export const rgbToHex = (r, g, b) => {
  console.log({ r, g, b });
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};
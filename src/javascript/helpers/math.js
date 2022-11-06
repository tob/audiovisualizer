const normalizeValue = (value) => (1 / 255) * value; // getting a value between 0 and 1 to use later 255 is the max value for audio

function getAverageValue(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export default { normalizeValue, getAverageValue };

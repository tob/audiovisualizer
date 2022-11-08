const normalizeValue = (value) => (1 / 255) * value; // getting a value between 0 and 1 to use later 255 is the max value for audio
function getPercentage(length, value) {
return length/100 * value
}

function getIndexFromValue(length, value) {
  return Math.round(length * ((1 / 127) * value));
}
function getAverageValue(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}



export { normalizeValue, getAverageValue, getIndexFromValue, getPercentage };

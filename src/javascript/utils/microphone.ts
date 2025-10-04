import { startAudioVisual } from "../drawings/startDrawing";

export {};

declare global {
  interface Window {
    persistAudioStream?: MediaStream;
  }
}

export default function handleMicrophone(button) {
  if (button.classList.contains("controller__button-start")) {
    window.listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", window.listening);
    startAudioVisual();
  } else {
    window.listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", window.listening);
  }
}

export function getAudioInput(stream) {
  window.persistAudioStream = stream;
  const audioContext = new AudioContext();
  const audioStream = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();

  // Better FFT size for frequency resolution (512 bins)
  analyser.fftSize = 1024;

  // Better range for music/voice (filters out very quiet noise)
  analyser.minDecibels = -70;
  analyser.maxDecibels = -10;

  // Smoothing for more stable visuals
  analyser.smoothingTimeConstant = 0.8;

  audioStream.connect(analyser);

  const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

  // Get sample rate to calculate actual frequencies
  const sampleRate = audioContext.sampleRate;
  const nyquist = sampleRate / 2;

  console.log(`Audio Analysis Setup:
    - Sample Rate: ${sampleRate}Hz
    - FFT Size: ${analyser.fftSize}
    - Frequency Bins: ${analyser.frequencyBinCount}
    - Frequency per Bin: ${nyquist / analyser.frequencyBinCount}Hz
    - Max Frequency: ${nyquist}Hz
  `);

  return {
    analyser,
    frequencyArray,
    sampleRate,
    nyquist
  };
}

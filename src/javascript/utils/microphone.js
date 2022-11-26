// import { startAudioVisual } from "../drawings/startDrawing.js";
import { startAudioVisual } from "../../videoAudiolizer/index.js";
export default function handleMicrophone(
  button,
  main,
  controlBoard,
  settings,
  listening
) {
  if (button.classList.contains("controller__button-start")) {
    window.listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", window.listening);
    startAudioVisual(main, controlBoard, settings);
    document.querySelector("#someone").className = ".hidden";
  } else {
    window.listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", window.listening);
    document.querySelector("#someone").className = "";
  }
}

export function getAudioInput(stream) {
  window.persistAudioStream = stream;
  const audioContent = new AudioContext();
  const audioStream = audioContent.createMediaStreamSource(stream);
  const analyser = audioContent.createAnalyser();
  analyser.fftSize = 64;
  analyser.minDecibels = -80;
  analyser.maxDecibels = 0;
  analyser.smoothingTimeConstant = 0.85;
  audioStream.connect(analyser);

  // filter out frequencies that hardly get used
  const unitArray = new Uint8Array(analyser.frequencyBinCount);

  // creating a new typed array for performance reasons
  const frequencyArray = new Uint8Array(unitArray.length);
  return { analyser, frequencyArray: frequencyArray.reverse() };
}

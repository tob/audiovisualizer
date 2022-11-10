import handleMicrophone from "./utils/microphone.js";
import { connectMidi } from "./utils/midi-controller.js";
import connectWebCam from "./utils/webcam.js";
import { addCanvas, createButtons } from "./drawings/drawSettings.js";
import { CanvasRecorder } from "./utils/recorder.js";
import { handleRecording } from "./utils/recorder.js";
import { settings } from "./utils/layer-settings.js";
import {shortenUrl} from "./utils/urlshortener.js"

let size = 1,
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

function appendImage(canvas, target, downloadButton) {
  // set canvasImg image src to data
  canvas.toBlob(function (blob) {
    target.src = URL.createObjectURL(blob);
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = `${Date.now()}-audiovisual.png`;
  }, "image/png");
}

function loadDrawingFromParams(parent, settings) {
  const search_params = new URLSearchParams(window.location.search);
  let index = 0;
  const levels = search_params.values();
  for (let value of levels) {
    const drawings = value.toString().split("&");
    drawings.map((prop) => {
      const keyValue = prop.split("=");
      if (settings[keyValue[0]]) {
        settings[keyValue[0]].value = keyValue[1];
      }
    });
    console.log("urlSettings", settings);
    createButtons(parent, settings, index);
    index++;
  }
}

// Start
window.onload = () => {
  connectMidi();
  connectWebCam();
  const startButton = document.getElementsByClassName(
    "controller__button-start"
  )[0];
  const shortenButton = document.getElementsByClassName(
    "controller__button-shorten"
  )[0];
  const plusButton = document.getElementsByClassName(
    "controller__button-add"
  )[0];
  const recordButton = document.getElementsByClassName(
    "controller__button-record"
  )[0];
  // const saveImageButton = document.getElementsByClassName(
  //   "controller__button-saveImage"
  // )[0];
  //
  // const snapshot = document.getElementsByClassName("snapshot")[0];
  //
  // const downloadButton = document.getElementsByClassName(
  //   "snapshot__download"
  // )[0];

  const controlBoard =
    document.getElementsByClassName("controller")[0] ||
    document.getElementById("controlboard");

  const main = document.getElementById("main");
  const canvas = addCanvas(main, controlBoard, settings);
  // Create Recorder
  const recorder = new CanvasRecorder(canvas);

  // Add drag and drop feature for draw settings
  dragula([controlBoard], {
    revertOnSpill: true,
    removeOnSpill: true,
    copySortSource: false,
    moves: function (el, container, handle) {
      return handle.classList.contains("container-buttons");
    },
    direction: "vertical",
  });

  if (window.location.search.includes("level")) {
    loadDrawingFromParams(controlBoard, settings);
  }

  // Grab buttons and assign functions onClick
  startButton.addEventListener("click", () => {
    handleMicrophone(startButton, main, controlBoard, settings);
  });

  shortenButton.addEventListener("click", () => {
    window.listening && handleMicrophone(startButton, main, controlBoard, settings);
    shortenUrl();
  });
  recordButton.addEventListener("click", () =>
    handleRecording(recordButton, recorder)
  );
  // saveImageButton.addEventListener("click", () =>
  //   appendImage(canvas, snapshot, downloadButton)
  // );

  // grab Add button and create dashboard
  plusButton.addEventListener("click", () => {
    const i =
      Array.prototype.slice.apply(
        document.getElementsByClassName("container-buttons")
      ).length + 1;
    createButtons(controlBoard, settings, i);
  });
};

export { size, WIDTH, HEIGHT, appendImage };

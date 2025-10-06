import { SourceSelector, SourceType } from "./step1/SourceSelector";
import { connectMidi } from "./utils/midi-controller";
import connectWebCam from "./utils/webcam";
import { addCanvas, createButtons } from "./step2/drawings/drawSettings";
import { CanvasRecorder, handleRecording } from "./utils/recorder";
import { settings } from "./utils/layer-settings";
import { shortenUrl } from "./utils/urlshortener";
import { startAudioVisual, stopAudioVisual } from "./step2/drawings/startDrawing";
import dragula from "dragula";
import "../styles/index.css";
import "../styles/step1/source-selector.css";
import "../styles/step2/controller.css";
import "../styles/step2/controlBoard.css";

declare global {
  interface Array<T> {
    random(): T;
  }
}

let size = 1,
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

function appendSnapshotImage(canvas, target, downloadButton) {
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

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

export const images = [...Array(11).keys()];

function appendImage(index, container) {
  const imageTag = document.createElement("img");
  imageTag.src = "assets/brass/00" + index + ".jpg";
  imageTag.id = "image-" + index;
  container.appendChild(imageTag);
}

// Store selected source globally
let selectedSource: SourceType;

// Handle start/stop visualization
function handleStartStop(button: Element) {
  if (button.classList.contains("controller__button-start")) {
    // Start visualization
    window.listening = true;
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    (button as HTMLElement).style.color = "red";
    button.classList.toggle("blink", window.listening);

    // Add small delay for video sources to ensure layout is settled
    if (selectedSource === 'file') {
      setTimeout(() => startAudioVisual(), 100);
    } else {
      startAudioVisual();
    }
  } else {
    // Stop visualization
    window.listening = false;
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    (button as HTMLElement).style.color = "#ccc";
    button.classList.toggle("blink", window.listening);

    stopAudioVisual();
  }
}

// Initialize Step 2: Main UI
function initializeMainUI() {
  connectMidi();
  connectWebCam();

  const imageWrapper = document.querySelector(".assets-container");
  images.map((img) => appendImage(img, imageWrapper));

  const startButton = document.getElementsByClassName("controller__button-start")[0];
  const shortenButton = document.getElementsByClassName("controller__button-shorten")[0];
  const plusButton = document.getElementsByClassName("controller__button-add")[0];
  const recordButton = document.getElementsByClassName("controller__button-record")[0];

  const controlBoard =
    document.getElementsByClassName("controller")[0] ||
    document.getElementById("controlboard");

  const main = document.getElementById("main");
  const canvas = addCanvas(main);
  const recorder = new CanvasRecorder(canvas);

  // Add drag and drop feature for draw settings
  dragula([controlBoard], {
    revertOnSpill: true,
    removeOnSpill: true,
    copySortSource: false,
    moves: function (_el, _container, handle) {
      return handle.classList.contains("container-buttons");
    },
    direction: "vertical",
  });

  // Load from URL params if present
  if (window.location.search.includes("level")) {
    loadDrawingFromParams(controlBoard, settings);
  }

  // Attach event listeners
  startButton.addEventListener("click", () => handleStartStop(startButton));

  shortenButton.addEventListener("click", () => {
    if (window.listening) {
      handleStartStop(startButton);
    }
    shortenUrl();
  });

  recordButton.addEventListener("click", () =>
    handleRecording(recordButton, recorder)
  );

  plusButton.addEventListener("click", () => {
    const i =
      Array.prototype.slice.apply(
        document.getElementsByClassName("container-buttons")
      ).length + 1;
    createButtons(controlBoard, settings, i);
  });

  // Create initial layer
  createButtons(controlBoard, settings, size);

  // Wait for layout to settle, then auto-start visualization
  setTimeout(() => {
    // Force canvas resize to ensure correct dimensions
    const allCanvases = document.querySelectorAll('canvas');
    allCanvases.forEach((canvas) => {
      const htmlCanvas = canvas as HTMLCanvasElement;
      htmlCanvas.width = window.innerWidth;
      htmlCanvas.height = window.innerHeight;
      console.log(`Canvas resized to: ${htmlCanvas.width}x${htmlCanvas.height}`);
    });

    // Auto-start visualization
    window.listening = true;
    startButton.classList.remove("controller__button-start");
    startButton.classList.add("controller__button-pause");
    startButton.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    (startButton as HTMLElement).style.color = "red";
    startButton.classList.toggle("blink", window.listening);

    // Add delay for media file sources (video/upload) to ensure proper canvas sizing
    if (selectedSource === 'file' || selectedSource === 'upload') {
      setTimeout(() => startAudioVisual(), 100);
    } else {
      startAudioVisual();
    }
  }, 200);
}

// Start: Step 1 - Source Selection
window.onload = () => {
  const sourceSelector = new SourceSelector('source-selector');

  sourceSelector.show((source: SourceType) => {
    // Store selected source
    selectedSource = source;

    console.log(`Source selected: ${source}`);

    // Initialize main UI (Step 2)
    initializeMainUI();
  });
};

export { size, WIDTH, HEIGHT, appendImage };

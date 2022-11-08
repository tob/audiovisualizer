import { startAudioVisual } from "../drawings/multiCanvas.js";
import { addCanvas, createButtons } from "../helpers/drawSettings.js";
import CanvasRecorder from "../utils/recorder.js";
import { getIndexFromValue, getPercentage } from "../helpers/math.js";
let size = 1,
  listening = false,
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

export const settings = {
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["low bass", "bass", "tenor", "alto", "soprano", "all"],
    value: "all",
  },
  pattern: {
    icon: "fa-route",
    list: [
      "center",
      "line",
      "spiral",
      "diagonal",
      "grid",
      "wave",
      "verticalWave",
      "circle",
      "cursor",
      "random",
      "clock",
    ],
    value: "line",
  },
  shape: {
    icon: "fa-shapes",
    list: ["triangle", "square", "circle", "star", "ninja"],
    value: "square",
  },
  size: {
    icon: "fa-search-plus",
    min: 0,
    max: 15,
    value: 7,
  },
  stroke: {
    icon: "fa-pen",
    checked: true,
  },
  color: {
    icon: "fa-palette",
    value: "#ff0f22",
  },
  opacity: {
    icon: "fa-eye",
    min: 0,
    max: 100,
    value: 70,
  },
  effect: {
    icon: "fa-chess-board",
    list: [
      "source-over",
      "multiply",
      "lighten",
      "difference",
      "exclusion",
      "color-dodge",
      "luminosity",
      "darken",
      "screen",
      "overlay",
      "xor",
      "copy",
      "destination-atop",
      "destination-over",
      "destination-out",
      "destination-in",
      "source-out",
      "source-in",
      "source-atop",
    ],
    value: "source-over",
  },
  twist: {
    icon: "fa-biohazard",
    checked: true,
  },
  rotationSpeed: {
    icon: "fa-sync",
    min: -10,
    max: 10,
    value: 1,
  },
};

function hexToRGB(hexColor) {
  return {
    r: (hexColor >> 16) & 0xff,
    g: (hexColor >> 8) & 0xff,
    b: hexColor & 0xff,
  };
}

function appendImage(canvas, target, downloadButton) {
  // set canvasImg image src to data
  canvas.toBlob(function (blob) {
    target.src = URL.createObjectURL(blob);
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = `${Date.now()}-audiovisual.png`;
  }, "image/png");
}

function handleMicrophone(button, main, controlBoard, settings) {
  if (button.classList.contains("controller__button-start")) {
    listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", listening);
    startAudioVisual(main, controlBoard, settings);
    document.querySelector("#someone").className = ".hidden";
  } else {
    listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", listening);
    document.querySelector("#someone").className = "";
  }
}

function handleRecording(button, recorder) {
  if (button.classList.contains("controller__button-download")) {
    recorder.save("canvas-recording");
    button.classList.remove("controller__button-download");
    button.classList.add("controller__button-record");
    button.innerHTML = "<i class='fa fa-circle'></i> Record";
    button.style.color = "#cccccc";
    return;
  }

  if (button.classList.contains("controller__button-stop")) {
    recorder.stop();
    listening = false;
    button.classList.toggle("blink");
    button.classList.remove("controller__button-stop");
    button.classList.add("controller__button-download");
    button.innerHTML = "<i class='fa fa-download'></i> Download";
  }

  if (button.classList.contains("controller__button-record")) {
    recorder.start();
    button.classList.toggle("blink");
    button.classList.remove("controller__button-record");
    button.classList.add("controller__button-stop");
    button.innerHTML = "<i class='fa fa-stop-circle'></i> Stop Record";
    button.style.color = "Red";
  }
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

function connectWebCam() {
  var video = document.querySelector("#someone");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}

function connectMidi(controls) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }
  }

  function getMIDIMessage(midiMessage) {
    const control = midiMessage.data[1];
    const value = midiMessage.data[2];
    const colorWell = document.querySelector(".controller__slider-color-1");

    switch (control) {
      case 3:
        const rangeControl = document.querySelector(
          ".controller__select-range-1"
        );
        const ranges = settings.range.list;
        rangeControl.value =
          ranges[getIndexFromValue(ranges.length - 1, value)];
        // const size = document.querySelector(".controller__slider-size-1");
        // size.value = value / 10;
        break;
      case 4:
        const patternControl = document.querySelector(
          ".controller__select-pattern-1"
        );
        const patterns = settings.pattern.list;
        patternControl.value =
          patterns[getIndexFromValue(patterns.length - 1, value)];
        break;
      case 5:
        const shape = document.querySelector(".controller__select-shape-1");
        const shapes = settings.shape.list;
        shape.value = shapes[getIndexFromValue(shapes.length - 1, value)];
        break;
      case 6:
        // const shape = document.querySelector(".controller__select-shape-1");
        // const shapes = settings.shape.list;
        // shape.value = shapes[Math.round(shapes.length * ((1 / 127) * value))];
        // console.log(shapes.length * ((1 / 127) * value));
        break;
      case 14:
        // rethink all of this, you get hex code but can only submit rgb.
        // you can use hexToRGB to parse but you need to encode back after
        const red = 255 * getPercentage(127, value);
        colorWell.value = {
          ...colorWell.value,
          r: red,
        };
        console.log({ red, ...colorWell.value });
        break;
      case 15:
        const green = 255 * getPercentage(127, value);
        colorWell.value = {
          ...colorWell.value,
          g: green,
        };

        break;
      case 16:
        const blue = 255 * getPercentage(127, value);
        colorWell.value = {
          ...colorWell.value,
          b: blue,
        };

        break;
      default:
        break;
    }

    console.log({ control, value });
  }

  function onMIDIFailure() {
    console.log("Could not access your MIDI devices.");
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
    listening && handleMicrophone(startButton, main, controlBoard, settings);
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

export { size, listening, WIDTH, HEIGHT, appendImage, hexToRGB };

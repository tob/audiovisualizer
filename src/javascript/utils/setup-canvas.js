let size = 1,
  listening = false,
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

const settings = {
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["low bass", "bass", "tenor", "alto", "soprano", "all"],
    value: "all"
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
      "random"
    ],
    value: "line"
  },
  shape: {
    icon: "fa-shapes",
    list: ["triangle", "square", "circle", "star", "ninja"],
    value: "square"
  },
  size: {
    icon: "fa-search-plus",
    min: 0,
    max: 15,
    value: 7
  },
  stroke: {
    icon: "fa-pen",
    checked: true
  },
  color: {
    icon: "fa-palette",
    value: "#ff0f22"
  },
  opacity: {
    icon: "fa-eye",
    min: 0,
    max: 100,
    value: 70
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
      "source-atop"
    ],
    value: "source-over"
  },
  twist: {
    icon: "fa-biohazard",
    checked: true
  },
  rotationSpeed: {
    icon: "fa-sync",
    min: -10,
    max: 10,
    value: 1
  }
};

function hexToRGB(hexColor) {
  return {
    r: (hexColor >> 16) & 0xff,
    g: (hexColor >> 8) & 0xff,
    b: hexColor & 0xff
  };
}

const appendImage = (canvas, target, downloadButton) => {
  // set canvasImg image src to data
  canvas.toBlob(function(blob) {
    target.src = URL.createObjectURL(blob);
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = `${Date.now()}-audiovisual.png`;
  }, "image/png");
};

const handleMicrophone = (button, main, controlBoard, settings) => {
  if (button.classList.contains("controller__button-start")) {
    listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", listening);
    startAudioVisual(main, controlBoard, settings);
  } else {
    listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", listening);
  }
};

const handleRecording = (button, recorder) => {
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
};


function loadDrawingFromParams(parent, settings) {
  const search_params = new URLSearchParams(window.location.search);
  let index = 0;
  const levels = search_params.values();
  for (let value of levels) {
    const drawings = value.toString().split("&");
    drawings.map(prop => {

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
  const startButton = document.getElementsByClassName(
    "controller__button-start"
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
    moves: function(el, container, handle) {
      return handle.classList.contains("container-buttons");
    },
    direction: "vertical"
  });

  if (window.location.search.includes("level")) {
    loadDrawingFromParams(controlBoard, settings);
  }

  // Grab buttons and assign functions onClick
  startButton.addEventListener("click", () => {
    handleMicrophone(startButton, main, controlBoard, settings);
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

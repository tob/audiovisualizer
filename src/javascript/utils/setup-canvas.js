let sensibility = 100,
  itemsNumber = 5,
  speed = 5,
  size = 1,
  opacity = 50,
  listening = false,
  effect = false,
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  colorWell = {
    r: 255,
    g: 0,
    b: 255
  };

const settings = {
  canvas: {
    icon: "fa-layer-group",
    list: [1, 2, 3, 4],
    value: 1
  },
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["bass", "bug-FIXME", "tenor", "alto", "soprano", "all"],
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
      "cone1",
      "cone2",
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
    value: 5
  },
  stroke: {
    icon: "fa-pen",
    checked: false
  },
  color: {
    icon: "fa-palette",
    value: "#00FFFF"
  },
  opacity: {
    icon: "fa-eye",
    min: 0,
    max: 100,
    value: 50
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
    checked: false
  },
  rotationSpeed: {
    icon: "fa-sync",
    min: -10,
    max: 10,
    value: 1
  },
  clear: {
    icon: "fa-bomb",
    checked: true
  }
  // saveImage: {
  //   icon: "fa-image"
  // },
  // download: {
  //   icon: "fa-download"
  // },
  // record: {
  //   icon: "fa-circle"
  // }
};

function hexToRGB(hexColor) {
  return {
    r: (hexColor >> 16) & 0xff,
    g: (hexColor >> 8) & 0xff,
    b: hexColor & 0xff
  };
}

const updateOpacity = (i, volume) => {
  opacity =
    volume ||
    document.getElementsByClassName(`controller__slider-opacity-${1}`)[0]
      .value / 100;
};

const appendImage = (canvas, target, downloadButton) => {
  // set canvasImg image src to data
  canvas.toBlob(function(blob) {
    target.src = URL.createObjectURL(blob);
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = `${Date.now()}-audiovisual.png`;
  }, "image/png");
};

const handleMicrophone = button => {
  if (button.classList.contains("controller__button-start")) {
    listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", listening);
  } else {
    listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start <i class='fa fa-play'></i>";
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

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  // document.getElementById("main").style.marginLeft = "250px";
  document.getElementsByClassName("snapshot")[0].style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementsByClassName("snapshot")[0].style.marginLeft = "0";
}

// Start
window.onload = () => {
  const startButton = document.getElementsByClassName(
    "controller__button-start"
  )[0];
  const plusButton = document.getElementsByClassName(
    "controller__button-add"
  )[0];
  // const recordButton = document.getElementsByClassName(
  //   "controller__button-record"
  // )[0];
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

  // Grab buttons and assign functions onClick
  startButton.addEventListener("click", () => {
    handleMicrophone(startButton);
    const canvas = addCanvas(main, controlBoard, settings);
    // Create Recorder
    // recorder = new CanvasRecorder(canvas);
    startAudioVisual();
  });
  // recordButton.addEventListener("click", () =>
  //   handleRecording(recordButton, recorder)
  // );
  // saveImageButton.addEventListener("click", () =>
  //   appendImage(canvas, snapshot, downloadButton)
  // );

  // grab Add button and create dashboard
  plusButton.addEventListener("click", () => {
    addCanvas(main, controlBoard, settings);
    // recorder = new CanvasRecorder(canvas);
    startAudioVisual();
  });
};

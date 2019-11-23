let sensibility = 100;
let itemsNumber = 5;
let speed = 5;
let size = 1;
let listening = false;
let effect = false;

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
    startVisualization();
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

const setupCanvas = () => {
  const canvas = document.getElementById("canvas");
  // size elements
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
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
  // grab our canvas
  setupCanvas();
  canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");

  const startButton = document.getElementsByClassName(
    "controller__button-start"
  )[0];
  const recordButton = document.getElementsByClassName(
    "controller__button-record"
  )[0];
  const saveImageButton = document.getElementsByClassName(
    "controller__button-saveImage"
  )[0];

  const snapshot = document.getElementsByClassName("snapshot")[0];

  const downloadButton = document.getElementsByClassName(
    "snapshot__download"
  )[0];

  // Create Recorder
  recorder = new CanvasRecorder(canvas);

  // Grab buttons and assign functions onClick
  startButton.addEventListener("click", () => handleMicrophone(startButton));
  recordButton.addEventListener("click", () =>
    handleRecording(recordButton, recorder)
  );
  saveImageButton.addEventListener("click", () =>
    appendImage(canvas, snapshot, downloadButton)
  );

  // grab itemsNumber slider
  document
    .getElementsByClassName("controller__slider-itemsNumber")[0]
    .addEventListener(
      "change",
      () =>
        (itemsNumber = document.getElementsByClassName(
          "controller__slider-itemsNumber"
        )[0].value)
    );

  // grab sensibility slider
  document
    .getElementsByClassName("controller__slider-sensibility")[0]
    .addEventListener(
      "change",
      () =>
        (sensibility =
          255 -
          document.getElementsByClassName("controller__slider-sensibility")[0]
            .value)
    );

  // grab speed slider
  document
    .getElementsByClassName("controller__slider-speed")[0]
    .addEventListener(
      "change",
      () =>
        (speed = document.getElementsByClassName("controller__slider-speed")[0]
          .value)
    );

  // grab size slider
  document
    .getElementsByClassName("controller__slider-size")[0]
    .addEventListener(
      "change",
      () =>
        (size = document.getElementsByClassName("controller__slider-size")[0]
          .value)
    );

  // grab effect selector
  document
    .getElementsByClassName("controller__select")[0]
    .addEventListener(
      "change",
      () =>
        (effect = document.getElementsByClassName("controller__select")[0]
          .value)
    );
};

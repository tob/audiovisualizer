/*
Setup microphone
*/
let audioContext = null,
  canvas = null,
  recorder = null,
  meter = null,
  canvasContext = null,
  rafID = null;

// User Interaction required to allow mic to listen
function resumePlayback(audioContext) {
  audioContext.resume().then(() => {
    console.log("Playback resumed successfully");
  });
}

// Start listening to Mic and draws
function startVisualization() {
  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();

  // // One-liner to resume playback when user interacted with the page.
  // startButton.addEventListener("click", () => resumePlayback(audioContext));

  // Attempt to get audio input
  try {
    // monkeypatch getUserMedia
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
      {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false"
          },
          optional: []
        }
      },
      gotStream,
      didntGetStream
    );
  } catch (e) {
    alert("getUserMedia threw exception :" + e);
  }
}

function didntGetStream() {
  alert("Stream generation failed.");
}

var mediaStreamSource = null;

function gotStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  drawLoop();
}

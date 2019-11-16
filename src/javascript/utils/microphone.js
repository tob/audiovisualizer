/*
Setup microphone
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var rafID = null;

window.onload = function() {
  // grab our canvas
  setupCanvas();
  canvasContext = document.getElementById("canvas").getContext("2d");
  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();
  // One-liner to resume playback when user interacted with the page.
  document.getElementById("button").addEventListener("click", function() {
    audioContext.resume().then(() => {
      document.getElementById("button").style.visibility = "hidden";
      document.getElementById("button").style.opacity = "0";
      console.log("Playback resumed successfully");
    });
  });

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
};

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

/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var rafID = null;
let lake;
let desert;
let gif;
let elmo;

window.onload = function() {
	lake = document.getElementById("lake");
	desert = document.getElementById("desert");
	gif = document.getElementById("gif");
	elmo = document.getElementById("elmo");
  // grab our canvas
  setupCanvas();
  canvasContext = document.getElementById("canvas").getContext("2d");
  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();

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

const colours = ["red", "orange", "yellow", "pink", "purple"];
let style = "black";
let counter = 0;


function drawLoop(time) {
  const pat = canvasContext.createPattern(lake, "repeat");
  const pat2 = canvasContext.createPattern(gif, "repeat");
  const pat3 = canvasContext.createPattern(desert, "repeat");
  const pat4 = canvasContext.createPattern(elmo, "repeat");
  const patterns = [pat, pat2, pat3, pat4];

  // check if we're currently clipping
  if (meter.checkClipping()) canvasContext.fillStyle = "red";
  else canvasContext.fillStyle = "green";

  counter++;
  if (counter >= colours.length - 1) {
    counter = 0;
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  }

  style = colours[counter];

  // console.log(meter.volume);
  const volume = meter.volume * 1000;
  if (volume > 300) {
    style = patterns[0];
  }

  if (volume < 50) {
    style = patterns[1];
  }

  if (volume > 50 && volume < 200) {
    style = patterns[2];
  }

  if (volume > 200 && volume < 300) {
    style = patterns[3];
  }
  // draw a bar based on the current volume
  // canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);

  canvasContext.fillStyle = style;
  canvasContext.fillRect(
    WIDTH / 2 - (WIDTH / 2 + meter.volume * 1000) / 2,
    HEIGHT / 6,
    WIDTH / 2 + meter.volume * 1000,
    HEIGHT / 4
  );
  canvasContext.fillRect(
    WIDTH / 2 - (HEIGHT / 4 + meter.volume * 1000) / 2,
    HEIGHT / 6,
    HEIGHT / 4 + meter.volume * 1000,
    HEIGHT - HEIGHT / 4
  );


  // style = colours[counter];
  // canvasContext.beginPath();
  // canvasContext.ellipse(WIDTH/2, HEIGHT/2, meter.volume*1000, meter.volume*1000, Math.PI / meter.volume*1000, 0, 2 * Math.PI, true);
  // // canvasContext.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
  // canvasContext.fill();

  // drawTriangle({
  // 	ctx: canvasContext,
  // 	canvasWidth: WIDTH,
  // 	canvasHeight: HEIGHT,
  // 	barHeight: meter.volume,
  // 	width: meter.volume*WIDTH*1.4,
  // 	speed: 20,
  // 	offset: 0,
  // 	style: style,
  // 	stroke: false
  // });

  // set up the next visual callback
  rafID = window.requestAnimationFrame(drawLoop);
}

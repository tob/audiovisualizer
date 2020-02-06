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

	document.getElementById('button').addEventListener('click', function() {
		audioContext.resume().then(() => {
			document.getElementById('button').style.visibility = 'hidden';
			console.log('Playback resumed successfully');
		});
	});

	canvasContext.font = "30px Comic Sans MS";
	canvasContext.fillStyle = "red";
	canvasContext.textAlign = "center";
	canvasContext.fillText("Click to start visualization", canvas.width/2, canvas.height/2);

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

const colours = ["white"];
let style = "black";
let counter = 0;

function drawLoop(time) {

	const volume = Math.abs((Math.log(meter.volume)*255/100)*40);

  // check if we're currently clipping
  // if (meter.checkClipping()) canvasContext.fillStyle = "red";
  // else canvasContext.fillStyle = "green";


  counter++;
  if (counter >= colours.length - 1) {
    counter = 0;
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  }

	canvasContext.fillStyle = `rgb(
        ${220 - volume},
        ${volume},
        ${220 - volume})`;
	canvasContext.fillRect(
		0, 0,
		WIDTH,
		HEIGHT
	);
	canvasContext.fill();


	style = colours[counter];

  // draw a bar based on the current volume
  // canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);
	// const topRectWidth = WIDTH / 2 + volume;

  // canvasContext.fillStyle = style;
  // canvasContext.fillRect(
  //   WIDTH / 2 - topRectWidth / 2,
  //   HEIGHT / 3 - topRectWidth/4,
  //   topRectWidth,
	//   topRectWidth/4
  // );
  // canvasContext.fillRect(
  //   WIDTH / 2 - topRectWidth/4 / 2,
  //   HEIGHT / 6,
	//   topRectWidth/4,
  //   HEIGHT - topRectWidth/4
  // );
  // canvasContext.fill();

		const y = HEIGHT/2 - volume/2;
// const y = 100;

	const topRectWidth = (WIDTH/2 + volume);
	const x = WIDTH/2 - topRectWidth/2;

	// TTTTTTT
	canvasContext.fillStyle = `rgb(
	      ${volume},
	      ${volume},
	      ${volume})`;
	canvasContext.beginPath();
	canvasContext.moveTo(WIDTH/2 - topRectWidth/2, y);
	canvasContext.lineTo(x *4, y );
	canvasContext.lineTo(x * 4, y*2 );
	canvasContext.lineTo(x*3, y*2);
	canvasContext.lineTo(x*3, y*4);
	canvasContext.lineTo(x*2, y*4);
	canvasContext.lineTo(x*2, y*2);
	canvasContext.lineTo(x, y*2);
	canvasContext.closePath();
	canvasContext.fill();

  // set up the next visual callback
  rafID = window.requestAnimationFrame(drawLoop);
}

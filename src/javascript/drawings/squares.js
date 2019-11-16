const colours = ["red", "orange", "yellow", "pink", "purple"];
let style = "black";
let counter = 0;
let x = 0;
let y = 0;
const center = { width: window.innerWidth / 2, height: window.innerHeight };

function drawLoop(time) {
	const gif = document.getElementById("gif");
  // check if we're currently clipping
  // if (meter.checkClipping()) canvasContext.fillStyle = "white";
  // else canvasContext.fillStyle = "#000000";

  // VOLUME get normalized
  // const volume = Math.abs((Math.log(meter.volume)/Math.LN10)*20);
  const volume = Math.abs((Math.log(meter.volume)/Math.LN10)*20)*100/20;
  // const volume = Math.abs(Math.floor(Math.log(meter.volume )*10));
  // if (volume >= 220 || volume <= 20) {
  //   console.log("Volume", volume);
  // }
  // const volume = Math.abs((Math.log(meter.volume)*255/100)*20);

  // VIDEOS and GIF need to be inside the loop to be re-catched and rendered
  // const pat = canvasContext.createPattern(lake, "repeat");
  // const pat2 = canvasContext.createPattern(gif, "repeat");
  // const pat3 = canvasContext.createPattern(desert, "repeat");
  // const pat4 = canvasContext.createPattern(elmo, "repeat");
  // const patterns = [pat, pat2, pat3, pat4];
	canvasContext.drawImage(gif, 100, 100)
  // const patterns = colours;

  // counter++;
  // if (counter >= colours.length - 1) {
  //   counter = 0;
  //   // clear the background
  // }

  // style = colours[counter];

  // CLEAR canvas
  // canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // canvasContext.fillStyle = style;
  canvasContext.fillStyle = `rgb(
        ${volume},
        ${255 - volume},
        ${volume})`;
  // canvasContext.beginPath();

  // if (volume > 300) {
  //   style = patterns[0];
  // }
  //
  // if (volume < 50) {
  //   style = patterns[1];
  // }
  //
  // if (volume > 50 && volume < 120) {
  //   style = patterns[2];
  // }

	x += volume/50;
	if (x >= WIDTH) {
		x = 20;
		y = Math.floor(Math.random() * (HEIGHT - volume)) + volume;
	}
	if (y >= HEIGHT) {
		y = 20;
	}

  if (volume > 120 && volume < 200) {
    // style = patterns[4];

    canvasContext.beginPath();
    canvasContext.arc(WIDTH / 2, HEIGHT / 2, volume, 0, 2 * Math.PI);
    canvasContext.fill();
  }

  // TOP CIRCLE
  canvasContext.beginPath();
  canvasContext.arc(x, y + volume / 100, volume, 0, 2 * Math.PI);
  canvasContext.fill();

  // BOTTOM CIRCLE
  canvasContext.beginPath();
  canvasContext.arc(
    WIDTH - x,
    HEIGHT - y - volume / 100,
    volume,
    0,
    2 * Math.PI
  );
  canvasContext.fill();

  // //ROTATE EVERYTHING
  // canvasContext.translate(WIDTH / 2, HEIGHT / 2);
  // // / Rotate 1 degree
  // // canvasContext.rotate(Math.PI / 180 * volume);
  // canvasContext.rotate(30);
  // // Move registration point back to the top left corner of canvas
  // canvasContext.translate(-WIDTH/2, -HEIGHT/2);

  // //TRIANGLE
  // canvasContext.strokeStyle = `rgb(
  //       ${255-volume},${255-volume},${volume})`;
  // canvasContext.beginPath();
  // canvasContext.moveTo(WIDTH / 2, HEIGHT / 2 - volume);
  // canvasContext.lineTo(WIDTH / 2 - volume, HEIGHT / 2 + volume);
  // canvasContext.lineTo(WIDTH / 2 + volume, HEIGHT / 2 + volume);
  // canvasContext.closePath();
  // canvasContext.stroke();

  // ARROW
  // canvasContext.strokeStyle = `rgb(
  //       ${255- 22.5 - volume},
  //       ${220 -volume},
  //       ${10 + volume})`;
  // canvasContext.beginPath();
  // canvasContext.moveTo(x, y);
  // canvasContext.lineTo(x - volume, y + volume);
  // canvasContext.lineTo(x + volume, y );
  // canvasContext.lineTo(x - volume, y - volume);
  // canvasContext.closePath();
  // canvasContext.stroke();
  // canvasContext.fill();

  //
  // let path2 = new Path2D();
  // path2.arc(x, y, volume, 0, 2 * Math.PI);

  // canvasContext.fill();
  // canvasContext.stroke(path2);

  // canvasContext.fillStyle = 'white';
  // // draw a bar based on the current volume
  // canvasContext.fillRect(x, y, meter.volume*1.4, 150+ volume);

  // set up the next visual callback
  rafID = window.requestAnimationFrame(drawLoop);
}

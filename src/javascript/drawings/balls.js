
const colours = ["red", "orange", "yellow", "pink", "purple"];
let style = "black";
let counter = 0;
let x = 0;
let y = 0;

function drawLoop(time) {
  // const pat = canvasContext.createPattern(lake, "repeat");
  // const pat2 = canvasContext.createPattern(gif, "repeat");
  // const pat3 = canvasContext.createPattern(desert, "repeat");
  // const pat4 = canvasContext.createPattern(elmo, "repeat");
  // const patterns = [pat, pat2, pat3, pat4];
  // const patterns = colours;

  // check if we're currently clipping
  // if (meter.checkClipping()) canvasContext.fillStyle = "white";
  // else canvasContext.fillStyle = "#000000";

  // counter++;
  // if (counter >= colours.length - 1) {
  //   counter = 0;
  //   // clear the background
  // }

  // style = colours[counter];

  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  // const volume = Math.abs((Math.log(meter.volume)/Math.LN10)*20);
  const volume = Math.abs((Math.log(meter.volume)*255/100)*40);

  // canvasContext.fillStyle = style;
  canvasContext.fillStyle = `rgb(
        ${volume},
        ${255 - volume},
        ${255 - volume})`;
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

  if (volume > 120 && volume < 200) {
    // style = patterns[4];
    x += Math.abs(volume / 100);
    if (x >= WIDTH) {
      x = 20;
      y = Math.floor(Math.random() * (HEIGHT - volume)) + volume;
    }
    if (y >= HEIGHT) {
      y = 20;
    }
    canvasContext.beginPath();
    canvasContext.arc(
      WIDTH/2,
      HEIGHT/2,
      volume,
      0,
      2 * Math.PI
    );
    canvasContext.fill();
  }
if (volume <= 100) {
  console.log('VOLume neg', volume);
}
  // TOP CIRCLE
  canvasContext.beginPath();
  canvasContext.arc(x, y + volume/100, volume, 0, 2 * Math.PI);
  canvasContext.fill();

  // BOTTOM CIRCLE
  canvasContext.beginPath();
  canvasContext.arc(WIDTH - x, HEIGHT - y - volume/100, volume, 0, 2 * Math.PI);
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

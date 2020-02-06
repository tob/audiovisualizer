let style = "black";
let counter = 0;
let x = Math.floor(Math.random() * (WIDTH - 1)) + 1;
let y = Math.floor(Math.random() * (HEIGHT - 1)) + 1;
const forks = "FORKS";
const backgrounds = [
  "desertdog.jpg",
  "fox.jpg",
  "monkey.jpg",
  "tunafish.jpg",
  "deer.jpg",
  "whale.jpg"
];
let dx = 1,
  dy = 1;

const center = { width: WIDTH / 2, height: HEIGHT/2 };


function drawLoop() {
  const newEyes = document.getElementById("newEyes");
  newEyes.width = "100%";
  newEyes.height = "100%";
  const pat = canvasContext.createPattern(newEyes, "repeat");

  // check if we're currently clipping
  if (meter.checkClipping()) canvasContext.fillStyle = "white";
  else canvasContext.fillStyle = "#000000";

  // VOLUME get normalized
  const volume = Math.abs(
    255 -
      Math.floor(
        (Math.abs((Math.log(meter.volume) / Math.LN10) * 20) * sensibility) / 25
      )
  );

  // COLOR SHADES
  const gradient2 = `rgb(
        ${colorWell.r - volume},
        ${colorWell.g - volume},
        ${colorWell.b - volume}, ${opacity})`;
  const gradient1 = `rgb(
        ${255 - colorWell.r - volume},
        ${255 - colorWell.g - volume},
        ${255 - colorWell.b - volume}, ${opacity})`;

  let { top, left } = updateDirection({
    x: Math.floor(x),
    y: Math.floor(y),
    volume: volume,
    sensibility: sensibility,
    speed: speed,
    shouldUpdate: volume > sensibility && volume < sensibility * 2
  });

  x += volume > 100 ? left : 0;
  y += volume > 200 ? top : 0;

  canvasContext.fillStyle = pat;

  if (counter >= 360) {
    counter = 0;
  }
  counter += Math.floor(((0.1 * volume) / sensibility) * 10);

  const drawAll = () => {
    walkingCircles({
      ctx: canvasContext,
      x: x - volume / 2,
      y: y - volume / 2,
      volume: volume + size*20,
      // strokeStyle: gradient1,
      fillStyle: pat
    })
    star({
      R: volume * size,
      cX: x,
      cY: y,
      N: itemsNumber > 3 ? itemsNumber : 3,
      fillStyle: pat,
      ctx: canvasContext
    });

    star({
      R: volume * size,
      cX: 0,
      cY: 0,
      N: itemsNumber > 3 ? itemsNumber : 3,
      fillStyle: pat,
      ctx: canvasContext
    });

    canvasContext.beginPath();
    canvasContext.fillStyle = pat;
    canvasContext.fillRect(WIDTH - x, HEIGHT - y, volume * size, 100 * size);
  };

  // CLEAR canvas
  // canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  // canvasContext.save();
  // canvasContext.fillStyle = pat;
  // canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  // canvasContext.restore();

  canvasContext.save();
  canvasContext.globalCompositeOperation = effect;
  canvasContext.fillStyle = gradient2;
  canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  canvasContext.restore();

  if (document.getElementsByClassName("controller__slider-rotate")[0].checked || volume > 150) {
    rotate({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      drawShape: drawAll,
      speed: speed,
      degree: counter,
      repeat: 4
    });
  } else {
    drawAll();
  }




  // drawTriangle({
  //   ctx: canvasContext,
  //   x: center.width,
  //   y: HEIGHT/2,
  //   barHeight: volume,
  //   width: size * volume,
  //   speed: speed,
  //   offset: 1,
  //   style: pat
  // })

  // drawTriangle({
  //   ctx: canvasContext,
  //   canvasWidth: WIDTH,
  //   canvasHeight: HEIGHT,
  //   barHeight: volume,
  //   width: size * volume,
  //   speed: speed,
  //   offset: 50,
  //   style: pat
  // });

  //TEXT
  canvasContext.beginPath();
  canvasContext.fillStyle = gradient2;
  canvasContext.font = `${volume / 3}px Tomorrow`;
  canvasContext.textAlign = "center";
  canvasContext.fillText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
  canvasContext.fillText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);

  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 2;
  canvasContext.strokeText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
  canvasContext.strokeText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);

  // // draw a bar based on the current volume
  canvasContext.fillRect(x, y, volume*1.4, 150+ volume);

  if (listening) {
    // set up the next visual callback
    rafID = window.requestAnimationFrame(() => drawLoop());
  }
}

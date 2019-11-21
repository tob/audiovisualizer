const colours = ["red", "orange", "yellow", "pink", "purple"];
let style = "black";
let counter = 0;
let x = 0;
let y = Math.floor(Math.random() * (window.innerHeight - 1)) + 1;
const forks = "FORKS";
let current = 0;
const backgrounds = [
  "desertdog.jpg",
  "fox.jpg",
  "monkey.jpg",
  "tunafish.jpg",
  "deer.jpg",
  "whale.jpg"
];

const center = { width: window.innerWidth / 2, height: window.innerHeight };

function drawLoop() {
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
  const gradient = `rgb(
        ${0},
        ${255 - volume},
        ${255 - volume})`;
  const gradient1 = `rgb(
        ${0},
        ${volume},
        ${volume}, 0.5)`;
  const gradient2 = `rgb(
        ${255 - volume},
        ${volume},
        ${volume}, 0.5)`;

  canvasContext.lineWidth = 3;

  if (volume > sensibility && volume < sensibility * 2) {
    x += volume / sensibility;
    // y += volume / 2;
    if (x >= WIDTH) {
      x = 20;
      // y += volume / sensibility;
      y = Math.floor(Math.random() * (HEIGHT - volume)) + volume;
    }
    if (y >= HEIGHT) {
      y = volume;
    }
  }

  //   rotate({
  //     x: WIDTH / 2,
  //     y: HEIGHT / 2,
  //     drawShape: () =>
  //       walkingCircles({
  //         ctx: canvasContext,
  //         x: x/2  - volume/2,
  //         y: y - volume/2,
  //         volume: volume/10,
  //         repeats: 1,
  //         // strokeStyle: 'black',
  //         fillStyle:gradient2,
  //       }),
  //     speed: speed,
  //     degree: Math.floor(Math.random() * Math.floor(360)),
  //     clockwise: true,
  //     repeat: 0
  //   });
  // }

  canvasContext.fillStyle = gradient2;
  canvasContext.strokeStyle = gradient2;

  // canvasContext.fillStyle = style;

  if (counter >= 360) {
    counter = 0;
  }
  counter += Math.floor(((0.1 * volume) / sensibility) * 10);

  if (document.getElementsByClassName("controller__slider-rotate")[0].checked) {
    rotate({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      drawShape: () =>
        star({
          R: volume * size,
          cX: 0,
          cY: 0,
          N: Math.floor(volume / 5),
          fillStyle: gradient1,
          strokeStyle: "black",
          ctx: canvasContext
        }),
      speed: speed,
      degree: counter,
      repeat: 4
    });
    rotate({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      drawShape: () =>
        walkingCircles({
          ctx: canvasContext,
          x: x / 2 - volume / 2,
          y: y - volume / 2,
          volume: (volume / 10) * size,
          repeats: itemsNumber,
          strokeStyle: "black",
          fillStyle: gradient2
        }),
      speed: speed,
      degree: counter,
      repeat: 4
    });
  } else {
    walkingCircles({
      ctx: canvasContext,
      x: x,
      y: y,
      volume: (volume / 10) * size,
      repeats: itemsNumber,
      // strokeStyle: 'black',
      fillStyle: gradient2
    });
  }

  // ROTATING SQUARES
  canvasContext.strokeStyle = gradient2;

  //TEXT
  // canvasContext.beginPath();
  // canvasContext.fillStyle = gradient2;
  // canvasContext.font = `${volume / 3}px Tomorrow`;
  // canvasContext.textAlign = "center";
  // canvasContext.fillText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
  // canvasContext.fillText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);
  //
  // canvasContext.strokeStyle = "black";
  // canvasContext.lineWidth = 2;
  // canvasContext.strokeText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
  // canvasContext.strokeText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);

  // // draw a bar based on the current volume
  // canvasContext.fillRect(x, y, volume*1.4, 150+ volume);

  if (listening) {
    // set up the next visual callback
    rafID = window.requestAnimationFrame(() => drawLoop());
  }
}

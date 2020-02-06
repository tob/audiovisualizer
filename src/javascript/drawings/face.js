let style = "black";
let x;
let y;
let dx = 1,
  dy = 1;

const center = { width: WIDTH / 2, height: HEIGHT / 2 };

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

  if (document.getElementsByClassName("controller__slider-move")[0].checked) {
    let { top, left } = updateDirection({
      x: Math.floor(x),
      y: Math.floor(y),
      volume: volume,
      sensibility: sensibility,
      speed: speed,
      shouldUpdate: volume > sensibility && volume < sensibility * 2
    });

    x += volume > 100 ? left : 0;
    y += volume > 100 ? top : 0;
  }


  canvasContext.beginPath();
  canvasContext.fillStyle = pat;

  // mouth
  canvasContext.fillStyle = "yellow";
  canvasContext.fillRect(0, 0, WIDTH, HEIGHT / 2 - volume * size);
  canvasContext.fillRect(0, 0, HEIGHT / 2 - volume * size, HEIGHT);

  let rectHeight = HEIGHT / 2 - volume * size;
  canvasContext.fillRect(0, HEIGHT - rectHeight, WIDTH, rectHeight);
  canvasContext.fillRect(
    WIDTH - rectHeight,
    0,
    WIDTH / 2 - volume * size,
    HEIGHT
  );

  // Eyes
  canvasContext.fillStyle = "white";
  let border = 20;
  canvasContext.fillRect(
    WIDTH / 4 - (200 - volume) / 2 - border,
    HEIGHT / 6 - border,
    200 - volume + border * 2,
    50 + border * 2
  );
  canvasContext.fillRect(
    WIDTH - WIDTH / 4 + ((200 - volume) / 2 + border),
    HEIGHT / 6 - border,
    -(200 - volume + border * 2),
    50 + border * 2
  );

  // center eyes
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(
    WIDTH / 4 - (200 - volume) / 2,
    HEIGHT / 6,
    200 - volume,
    50
  );
  canvasContext.fillRect(
    WIDTH - WIDTH / 4 + (200 - volume) / 2,
    HEIGHT / 6,
    -(200 - volume),
    50
  );

  if (listening) {
    // set up the next visual callback
    rafID = window.requestAnimationFrame(() => drawLoop());
  }
}

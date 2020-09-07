var cursorX;
var cursorY;
document.onmousemove = function(e) {
  cursorX = e.pageX;
  cursorY = e.pageY;
};

// return true if in range, otherwise false
function inRange(x, min = 0, max) {
  return (x - min) * (x - max) <= 0;
}

function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
  let cx = x;
  let cy = y;
  let rot = (Math.PI / 2) * 3;
  let step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
}

// FORK
function fork(x, y, volume) {
  canvasContext.lineWidth = 5;
  canvasContext.strokeStyle = "silver";
  canvasContext.fillStyle = "silver";
  for (let i = 0; i < 4; i++) {
    canvasContext.beginPath();
    canvasContext.moveTo(2 * i * 10, volume);
    canvasContext.bezierCurveTo(
      20 + i * 10,
      150 + i * 10,
      20 + i * 10,
      50 + i * 10,
      100,
      100
    );
    canvasContext.stroke();
  }

  canvasContext.beginPath();
  canvasContext.moveTo(x, y);
  canvasContext.lineTo(x * 3, y * 2);
  canvasContext.lineTo(x * 3 + 20, y * 2);
  canvasContext.closePath();
  canvasContext.stroke();
  canvasContext.fill();
}

// draw spiral
function circlePos(radius, i) {
  // var x = Math.cos(ang) * distance;
  // var y = Math.sin(ang) * distance;

  return {
    width: radius * Math.cos(((360 / 60) * (i - 15) * Math.PI) / 180),
    height: radius * Math.sin(((360 / 60) * (i - 15) * Math.PI) / 180)
  };
}

function spiralPos(radius, volume, i) {
  return {
    width: (radius + i * (Math.PI * 2)) * Math.cos((i * (Math.PI * 2)) / 50),
    height: (radius + i * (Math.PI * 2)) * Math.sin((i * (Math.PI * 2)) / 50)
  };
}

function drawShape({ ctx, x, y, width, style, stroke, mode, i }) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.strokeStyle = stroke;
  switch (mode) {
    case "square":
      ctx.fillRect(x - width / 2, y - width / 2, width, width);
      stroke && ctx.strokeRect(x - width / 2, y - width / 2, width, width);
      break;
    case "circle":
      ctx.arc(x, y, width, 0, 2 * Math.PI);
      break;
    case "triangle":
      drawStar(ctx, x, y, 3, width, width / 2);
      break;
    case "star":
      drawStar(ctx, x, y, 5, width, width / 2);
      break;
    case "ninja":
      drawStar(ctx, x, y, 4, width, width / 2 + i);

      break;
  }

  ctx.closePath();

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  if (style) {
    ctx.fillStyle = style;
    ctx.fill();
  }
}

function findTime() {
  let time = new Date();
  let hour = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();

  hour = hour + min / 60;
  min = min + sec / 60;
  sec = sec;

  return {
    hour,
    min,
    sec
  };
}

function findTimeofI(i, radius, arrayLength) {
  const { sec, min, hour } = findTime();
  let time = sec;
  let timeUnits = 60;
  let timeRadius = radius * (i / 10);
  if (i > arrayLength / 4) {
    const newIndex = i - arrayLength / 4;
    time = min;
    timeRadius = radius * (newIndex / 15);
  }

  if (i > arrayLength / 2) {
    const newIndextwo = i - arrayLength / 2;
    time = hour;
    timeRadius = radius * (newIndextwo / 20);
    timeUnits = 12;
  }

  return {
    time,
    timeUnits,
    timeRadius
  };
}

function getClockHandsPosition(time, units, radius) {
  return {
    width: radius * Math.cos(((360 / units) * (time - 15) * Math.PI) / 180),
    height: radius * Math.sin(((360 / units) * (time - 15) * Math.PI) / 180)
  };
}

function smoothLine(ctx, canvas, arrayFreq) {
  ctx.beginPath();

  let xPos = 0;
  let yPos = canvas.height;

  // move to the first point
  ctx.moveTo(xPos, yPos);

  for (let i = 0; i < arrayFreq.length; i++) {
    let barHeight = arrayFreq[i];
    yPos = canvas.height / 2;

    // if (i % 5 === 0) {
    //   if (i % 2 === 0) {
    //     var xc = xPos + (canvas.width / arrayFreq.length + 1);
    //     var yc = canvas.height / 2 - barHeight;
    //     ctx.quadraticCurveTo(xPos, yPos, xc, yc);
    //   } else {
    //     var xc = xPos + (canvas.width / arrayFreq.length + 1);
    //     var yc = canvas.height / 2 + barHeight;
    //     ctx.quadraticCurveTo(xPos, yPos, xc, yc);
    //   }
    // }

    xPos += canvas.width / arrayFreq.length + 1;
  }
  // curve through the last two points
  ctx.quadraticCurveTo(xPos, canvas.height / 2, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.closePath();

  // console.log('path', arrayFreq)
}

function drawBars(arrayFreq, canvasContext, canvas) {
  let xPos = 0;
  for (let i = 0; i < arrayFreq.length; i++) {
    let barHeight = arrayFreq[i];

    let r = barHeight + 25 * (i / arrayFreq.length);
    let g = 250 * (i / arrayFreq.length);
    let b = 50;
    canvasContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    canvasContext.fillRect(
      xPos,
      canvas.height - barHeight,
      canvas.width / arrayFreq.length,
      barHeight
    );
    xPos += canvas.width / arrayFreq.length + 1;
  }
}

function drawPattern({
  ctx,
  canvas,
  radius,
  volume,
  width,
  size,
  i,
  shape,
  mode = "circle",
  twist,
  arrayLength
}) {
  const { time, timeUnits, timeRadius } = findTimeofI(i, radius, arrayLength);
  const squares = Math.sqrt(arrayLength) > 0 ? Math.sqrt(arrayLength) : 1;
  const modes = {
    circle: {
      x:
        (radius + canvas.width / 20) * Math.cos((i * Math.PI * 2) / 255) +
        canvas.width / 2,
      y:
        (radius + canvas.width / 20) * Math.sin((i * Math.PI * 2) / 255) +
        canvas.height / 2
    },
    spiral: {
      x: spiralPos(radius, volume, i).width + canvas.width / 2,
      y: spiralPos(radius, volume, i).height + canvas.height / 2
    },
    wave: {
      x: (canvas.width / 255) * i,
      y:
        (radius + canvas.width / 20) * Math.sin((i * Math.PI * 2) / 255) +
        canvas.height / 2
    },
    verticalWave: {
      x:
        (radius + canvas.width / 20) * Math.cos((i * Math.PI * 2) / 255) +
        canvas.width / 2,
      y: (canvas.height / 255) * i
    },
    line: {
      x: (canvas.width / 255) * i,
      y: canvas.height / 2
    },
    diagonal: {
      x: (canvas.width / 255) * i,
      y: canvas.height - (canvas.height / 255) * i
    },
    grid: {
      x: getXpos(squares, canvas, i) + width,
      y:
        (canvas.height / squares) * Math.floor(i / squares) + canvas.height / squares
    },
    center: {
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    cursor: {
      x: cursorX,
      y: cursorY
    },
    clock: {
      x:
        getClockHandsPosition(time, timeUnits, timeRadius).width +
        canvas.width / 2,
      y:
        getClockHandsPosition(time, timeUnits, timeRadius).height +
        canvas.height / 2
    },
    random: {
      x: Math.floor(Math.random() * canvas.width) + 1,
      y:
        (canvas.height / 15) * Math.floor(i / 15) -
        (volume * size) / 2 +
        canvas.height / 15 / 2
    }
  };
  const xPos = modes[mode].x;
  const yPos = modes[mode].y;

  rotate({
    ctx,
    x: xPos,
    y: yPos,
    drawShape: () => shape(xPos, yPos),
    degree: twist && (360 / 255) * (volume / 255)
  });
}

const getXpos = (colNumber, canvas, i) => {
  let position = canvas.width / 2;

  if (Math.floor(i / colNumber) > 0) {
    position = (canvas.width / colNumber) * (i % colNumber);
  }

  if (i < colNumber) {
    position = (canvas.width / colNumber) * i;
  }

  return position;
};

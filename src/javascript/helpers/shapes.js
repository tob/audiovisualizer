// return true if in range, otherwise false
function inRange(x, min = 0, max) {
  return (x - min) * (x - max) <= 0;
}

// Centered triangles
const increment = (canvasWidth, barHeight, speed) => {
  if (barHeight > speed) {
    return Math.abs(Math.pow(barHeight, 2) - 10) / (canvasWidth - 10) / 4;
  }
  // smooth the accelerations
  return 0.5;
};

const getTrianglePoints = ({
  canvasWidth,
  canvasHeight,
  barHeight,
  width,
  speed,
  offset
}) => {
  width += increment(canvasWidth, barHeight, speed);

  if (offset) {
    width += offset;
    width = width > 0 ? width : 0;
  }

  const verticalDown =
    canvasHeight / 2 + width >= canvasHeight
      ? canvasHeight
      : canvasHeight / 2 + width;

  const topX = canvasWidth / 2;
  const topY = canvasHeight / 2 - width;
  const leftX = canvasWidth / 2 - width;
  const leftY = verticalDown;
  const rightX = canvasWidth / 2 + width;
  const rightY = verticalDown;

  return {
    topX,
    topY,
    leftX,
    leftY,
    rightX,
    rightY
  };
};

const drawTriangle = ({
  ctx,
  canvasWidth,
  canvasHeight,
  barHeight,
  width,
  speed,
  offset,
  style,
  stroke
}) => {
  const { topX, topY, leftX, leftY, rightX, rightY } = getTrianglePoints({
    canvasWidth,
    canvasHeight,
    barHeight,
    width,
    speed,
    offset
  });
  ctx.save();
  ctx.fillStyle = style;
  // the triangle
  ctx.beginPath();
  // top corner
  ctx.moveTo(topX, topY);
  //left corner
  ctx.lineTo(leftX, leftY);
  //right corner
  ctx.lineTo(rightX, rightY);

  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  ctx.fill();
  ctx.restore();
};

//////////
//function to draw star with N spikes
//centered on a circle of radius R, centered on (cX,cY)
function star({ R, cX, cY, N, strokeStyle, fillStyle, ctx }) {
  //star draw
  ctx.beginPath();
  ctx.moveTo(cX + R, cY);
  for (var i = 1; i <= N * 2; i++) {
    if (i % 2 == 0) {
      var theta = (i * (Math.PI * 2)) / (N * 2);
      var x = cX + R * Math.cos(theta);
      var y = cY + R * Math.sin(theta);
    } else {
      var theta = (i * (Math.PI * 2)) / (N * 2);
      var x = cX + (R / 2) * Math.cos(theta);
      var y = cY + (R / 2) * Math.sin(theta);
    }

    ctx.lineTo(x, y);
  }
  ctx.closePath();

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
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

// Walking circles
function walkingCircles({
  ctx,
  x = 0,
  y = 0,
  volume = 90,
  repeats = 1,
  fillStyle,
  strokeStyle
}) {
  for (let i = 0; i <= repeats; i++) {
    // const yPosition = inRange(y + volume * i, 0, HEIGHT) ? (y + volume) * i + (y + volume)/i;

    let { top, left } = updateDirection({
      x: x +1,
      y: (HEIGHT / 2 / repeats) * i,
      sensibility: i,
      volume: volume,
      speed: speed,
      shouldUpdate: true
    });

    // TOP CIRCLE
    ctx.beginPath();
    ctx.arc(x + left, y + top, volume * i, 0, 2 * Math.PI);

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    // if (effect) {
    //   ctx.globalCompositeOperation = null;
    // }
  }
}

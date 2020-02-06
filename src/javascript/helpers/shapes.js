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

// Centered triangles
const increment = (width, volume, speed) => {
  if (volume > speed) {
    return Math.abs(Math.pow(volume, 2) - 10) / (width - 10) / 4;
  }
  // smooth the accelerations
  return 0.5;
};

const getTrianglePoints = ({ x, y, volume, width, speed, offset }) => {
  width += increment(x, volume, speed);

  if (offset) {
    width += offset;
    width = width > 0 ? width : 0;
  }

  const verticalDown = y + width;

  const topX = x;
  const topY = y - width;
  const leftX = x - width;
  const leftY = verticalDown;
  const rightX = x + width;
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
  x,
  y,
  volume,
  width,
  speed,
  offset,
  style,
  stroke
}) => {
  // console.log('start triangle')
  const { topX, topY, leftX, leftY, rightX, rightY } = getTrianglePoints({
    x,
    y,
    volume,
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

const drawCircle = ({ ctx, x, y, radius, volume }) => {
  // ctx.arc(
  //   circlePos(1, adjustedLength, i).width / 2,
  //   circlePos(1, adjustedLength, i).height / 2,
  //   (adjustedLength / 10) * size,
  //   0,
  //   2 * Math.PI
  // );
};

// draw spiral
function circlePos(radius, volume, i) {
  const diameter = (radius + volume) * size;
  return {
    width: radius * Math.cos((i * (Math.PI * 2)) / 255),
    height: radius * Math.sin((i * (Math.PI * 2)) / 255)
  };
}

function drawShape({ ctx, x, y, width, style, stroke, mode, i }) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.strokeStyle = stroke;
  switch (mode) {
    case "square":
      ctx.fillRect(x - width / 2, y - width / 2, width, width);
      ctx.strokeRect(x - width / 2, y - width / 2, width, width);
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

function pattern({
  ctx,
  canvas,
  radius,
  volume,
  i,
  shape,
  mode = "circle",
  twist
}) {
  const modes = {
    circle: {
      x: radius * Math.cos((i * Math.PI) / 255) + canvas.width / 2,
      y: radius * Math.sin((i * Math.PI) / 255) + canvas.height / 2
    },
    spiral: {
      x: circlePos(radius, volume, i).width + canvas.width / 2,
      y: circlePos(radius, volume, i).height + canvas.height / 2
    },
    cone1: {
      x: (canvas.width / 255) * i,
      y: radius * Math.sin((360 / 255) * i * Math.PI) + canvas.height / 2
    },
    cone2: {
      x:
        radius * Math.cos((360 / 255) * i * Math.PI) + (canvas.width / 255) * i,
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
      x: getXpos(15, canvas, i) + canvas.width / 15 / 2,
      y: (canvas.height / 15) * Math.floor(i / 15) - canvas.height / 15 / 2
    },
    center: {
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    cursor: {
      x: cursorX,
      y: cursorY
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
    degree: (360 / 255) * (volume / 255),
    clockwise: i % 2 == 0,
    active: twist
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

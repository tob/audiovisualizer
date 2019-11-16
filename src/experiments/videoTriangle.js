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

const start = function() {
  const state = {
    background: "#000",
    foreground: "#ffffff",
    barHeight: 0,
    counter: 0,
    triangleWidth: 10,
    triangleStyle: "#000",
    triangleOddWidth: 10,
    triangleOddStyle: "#fff",
    sensibility: 10,
    repetitions: 40
  };

  // grab elements from html
  const audio = document.getElementById("audio");
  const lake = document.getElementById("lake");
  const desert = document.getElementById("desert");
  const gif = document.getElementById("gif");
  const canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // size elements
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  lake.width = window.innerWidth;
  lake.height = window.innerHeight;
  gif.width = window.innerWidth;
  gif.height = window.innerHeight;
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const animateShape = (shape, props, layers, styles) => {
    for (i = 0; i <= layers; i++) {
      const style = i % 2 === 0 ? 1 : i % 3 === 0 ? 2 : 0;
      props.style = styles[style];

      props.offset = -((WIDTH * 2) / layers) * i;
      shape(props);
    }
  };

  // start music and capture signal
  audio.play();
  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function renderFrame() {
    const pat = ctx.createPattern(lake, "repeat");
    const pat2 = ctx.createPattern(gif, "repeat");
    const pat3 = ctx.createPattern(desert, "repeat");
    state.background = state.counter % 2 === 0 ? pat : pat2;
    state.foreground = state.background === pat2 ? pat : pat2;
    const { background, foreground } = state;

    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bufferLength && i % 2 === 0; i++) {
      state.barHeight = dataArray[i] > state.sensibility ? dataArray[i] : 0;
      const { barHeight } = state;

      state.triangleWidth += increment(WIDTH, barHeight, state.sensibility);

      if (state.triangleWidth >= WIDTH * 2) {
        state.triangleWidth = 0;
        // state.background = foreground;
      }

      animateShape(
        drawTriangle,
        {
          ctx: ctx,
          canvasWidth: WIDTH,
          canvasHeight: HEIGHT,
          barHeight: barHeight,
          width: state.triangleWidth,
          speed: state.sensibility,
          offset: 0,
          style: foreground,
          stroke: false
        },
        (barHeight * state.repetitions) / 255 > 0
          ? (barHeight * state.repetitions) / 255
          : 2,
        [background, foreground, pat3]
      );
    }
  }

  renderFrame();
};

start();

const rotate = ({ x, y, drawShape, degree, clockwise, repeat }) => {
  if (degree >= 360 || degree <= -360) {
    return;
  }
  canvasContext.save();
  canvasContext.translate(x, y);

  // Rotate 1 degree
  // canvasContext.rotate(Math.PI / 180);

  if (clockwise) {
    canvasContext.rotate(-degree);
  } else {
    canvasContext.rotate(+degree);
  }
  drawShape();

  canvasContext.translate(-x, -y);
  canvasContext.restore();

  if (repeat > 1) {
    let i;
    for (i = 0; i <= repeat; i++) {
      degree += i * (360 / repeat);
      rotate({ x, y, drawShape, degree, clockwise });
    }
  }
};

const updateDirection = ({ x, y, sensibility, volume, speed }) => {
  let top =
    (isFinite(Math.abs(volume * speed / sensibility)) &&
      Math.abs(volume * speed / sensibility) ) ||
    0;
  let left =
    (isFinite(Math.abs(volume * speed / sensibility)) &&
      Math.abs(volume * speed / sensibility)) ||
    0;

  if (x > WIDTH) {
    dx = -1;
  }

  if (x < 0) {
    dx = 1;
  }

  if (y > HEIGHT) {
    dy = -1;
  }

  if (y < 0) {
    dy = 1;
  }

  return {
    top: dy === 1 ? top : -top,
    left: dx === 1 ? left : -left
  };
};

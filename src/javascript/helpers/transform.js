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
      degree += i * (360/repeat);
      rotate({ x, y, drawShape, degree, clockwise });
    }
  }
};



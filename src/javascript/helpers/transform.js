const rotate = ({ctx, x, y, drawShape, degree, clockwise, active }) => {
  if (!active){
    drawShape();
    return;
  }


  if (degree >= 360 || degree <= -360) {
    return;
  }
  ctx.save();
  ctx.translate(x, y);

  // Rotate 1 degree
  // ctx.rotate(Math.PI / 180);

  if (clockwise) {
    ctx.rotate(-degree);
  } else {
    ctx.rotate(+degree);
  }
  ctx.translate(-x, -y);
  drawShape();

  ctx.restore();
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

const rotate = ({ ctx, x, y, draw, degree }) => {
  if (degree >= 360 || degree <= -360) {
    return;
  }

  if (degree !== 0) {
    ctx.save();
    ctx.translate(x, y);

    // Rotate 1 degree
    // ctx.rotate(Math.PI / 180);

    ctx.rotate(degree);
    ctx.translate(-x, -y);
    draw();

    ctx.restore();
  } else {
    draw();
  }
};

const updateDirection = ({ x, y, sensibility, volume, speed }) => {
  let top =
    (isFinite(Math.abs((volume * speed) / sensibility)) &&
      Math.abs((volume * speed) / sensibility)) ||
    0;
  let left =
    (isFinite(Math.abs((volume * speed) / sensibility)) &&
      Math.abs((volume * speed) / sensibility)) ||
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

import { WIDTH, HEIGHT } from "..";

function rotate({ ctx, x, y, draw, degree }) {
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
    draw(x, y);

    ctx.restore();
  } else {
    draw(x, y);
  }
}

function updateAngles({ angles, prevAverage, rotationSpeed }) {
  if (angles >= 360) {
    return 0;
  }
  return angles + (prevAverage * rotationSpeed) / 10000;
}

export { rotate, updateAngles };

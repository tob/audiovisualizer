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
	console.log('trying a triangle', style)
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

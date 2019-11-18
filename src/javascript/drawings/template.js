const colours = ["red", "orange", "yellow", "pink", "purple"];
let style = "black";
let counter = 0;
let x = 0;
let y = 0;
const forks = "FORKS";
let current = 0;
const backgrounds = [
	"desertdog.jpg",
	"fox.jpg",
	"monkey.jpg",
	"tunafish.jpg",
	"deer.jpg",
	"whale.jpg"
];

const center = { width: window.innerWidth / 2, height: window.innerHeight };

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

function drawLoop(time) {
	// check if we're currently clipping
	if (meter.checkClipping()) canvasContext.fillStyle = "white";
	else canvasContext.fillStyle = "#000000";

	// VOLUME get normalized
	const volume = Math.abs(
		255 - (Math.abs((Math.log(meter.volume) / Math.LN10) * 20) * 100) / 25
	);
	// const volume = Math.abs((Math.log(meter.volume)/Math.LN10)*20);
	// const volume = Math.abs(Math.floor(Math.log(meter.volume )*10));
	// const volume = Math.abs((Math.log(meter.volume)*255/100)*20);

	// VIDEOS and GIF need to be inside the loop to be re-catch and rendered
	// const pat = canvasContext.createPattern(lake, "repeat");
	// const pat2 = canvasContext.createPattern(gif, "repeat");
	// const pat3 = canvasContext.createPattern(desert, "repeat");
	// const pat4 = canvasContext.createPattern(elmo, "repeat");
	// const patterns = [pat, pat2, pat3, pat4];
	// const patterns = colours;

	// COLOR SHADES
	const gradient = `rgb(
        ${0},
        ${255 - volume},
        ${255 - volume})`;
	const gradient1 = `rgb(
        ${0},
        ${volume},
        ${volume}, 0.5)`;
	const gradient2 = `rgb(
        ${255 - volume},
        ${volume},
        ${volume}, 0.5)`;

	canvasContext.lineWidth = 6;

	// CLEAR canvas
	canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

	// UPDATE BACKGROUND IMAGE
	if (volume > 200) {
		current++;
		if (current >= backgrounds.length - 1) {
			current = 0;
		}
		document.getElementById(
			"background"
		).src = `assets/${backgrounds[current]}`;
	}

	// BACKGROUND IMAGE
	canvasContext.beginPath();
	canvasContext.drawImage(
		document.getElementById("background"),
		0 - volume / 2,
		0 - volume / 2,
		WIDTH + volume,
		HEIGHT + volume
	);

	// BACKGROUND COLOR OVERLAY
	canvasContext.fillStyle = gradient1;
	canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

	if (volume > 100 && volume < 200) {
		// style = patterns[4];
		x += volume / 100;
		if (x >= WIDTH) {
			x = 20;
			y = Math.floor(Math.random() * (HEIGHT - volume)) + volume;
		}
		if (y >= HEIGHT) {
			y = 20;
		}
	}

	canvasContext.fillStyle = gradient1;
	canvasContext.strokeStyle = gradient2;

	// canvasContext.fillStyle = style;

	rotate({
		x: WIDTH / 2,
		y: HEIGHT / 2,
		drawShape: () => {
			// TOP CIRCLE
			canvasContext.beginPath();
			canvasContext.arc(x, y + volume / 100, volume, 0, 2 * Math.PI);
			// canvasContext.fill();
			canvasContext.stroke();
			//
			// // BOTTOM CIRCLE
			canvasContext.beginPath();
			canvasContext.arc(
				WIDTH - x,
				HEIGHT - y - volume / 100,
				volume,
				0,
				2 * Math.PI
			);
			// canvasContext.fill();
			canvasContext.stroke();
		},
		degree: 30,
		repeat: 10
	});

	if (counter >= 360) {
		counter = 0;
	}
	counter += (0.1 * volume) / 1000;
	rotate({
		x: WIDTH / 2,
		y: HEIGHT / 2,
		drawShape: () =>
			star({
				R: HEIGHT / 2 + volume,
				cX: 0,
				cY: 0,
				N: Math.floor(volume / 5),
				// fillStyle: gradient1,
				strokeStyle: gradient2,
				ctx: canvasContext
			}),
		speed: 30,
		degree: counter,
		clockwise: true,
		repeat: 5
	});

	// FORK
	// rotate({
	//   x: WIDTH / 2,
	//   y: HEIGHT / 2,
	//   drawShape: () => fork(100, 100, volume),
	//   speed: 30,
	//   degree: counter,
	//   clockwise: false
	// });

	//TRIANGLE HELPER
	// drawTriangle({
	//   ctx: canvasContext,
	//   canvasWidth: WIDTH,
	//   canvasHeight: HEIGHT,
	//   barHeight: volume,
	//   width: volume + 100,
	//   speed: 30,
	//   offset: 0,
	//   style: gradient2
	// });

	// ROTATING SQUARES
	canvasContext.strokeStyle = gradient2;
	rotate({
		x: WIDTH / 2,
		y: HEIGHT / 2,
		drawShape: () =>
			canvasContext.strokeRect(
				-(volume + 100) / 2,
				-(volume + 100) / 2,
				volume + 100,
				volume + 100
			),
		speed: 30,
		degree: counter,
		clockwise: false,
		repeat: 4
	});

	//TEXT
	canvasContext.beginPath();
	canvasContext.fillStyle = gradient2;
	canvasContext.font = `${volume / 3}px Tomorrow`;
	canvasContext.textAlign = "center";
	canvasContext.fillText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
	canvasContext.fillText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);

	canvasContext.strokeStyle = "black";
	canvasContext.lineWidth = 2;
	canvasContext.strokeText(`WHAT IS THE FUTURE OF `, WIDTH / 2, HEIGHT / 2);
	canvasContext.strokeText(`${forks}?`, WIDTH / 2, HEIGHT / 2 + volume / 2);

	//TRIANGLE
	// canvasContext.fillStyle = `rgb(${255 - volume},${255 - volume},${volume})`;
	// canvasContext.beginPath();
	// canvasContext.moveTo(0,0 - volume);
	// canvasContext.lineTo(0 - volume, 0 + volume);
	// canvasContext.lineTo(0 + volume, 0 + volume);
	// canvasContext.closePath();
	// canvasContext.fill();

	// ARROW
	// canvasContext.strokeStyle = `rgb(
	//       ${255- 22.5 - volume},
	//       ${220 -volume},
	//       ${10 + volume})`;
	// canvasContext.beginPath();
	// canvasContext.moveTo(x, y);
	// canvasContext.lineTo(x - volume, y + volume);
	// canvasContext.lineTo(x + volume, y );
	// canvasContext.lineTo(x - volume, y - volume);
	// canvasContext.closePath();
	// canvasContext.stroke();
	// canvasContext.fill();

	//
	// let path2 = new Path2D();
	// path2.arc(x, y, volume, 0, 2 * Math.PI);

	// canvasContext.fill();
	// canvasContext.stroke(path2);

	// canvasContext.fillStyle = 'white';
	// // draw a bar based on the current volume
	// canvasContext.fillRect(x, y, meter.volume*1.4, 150+ volume);

	// set up the next visual callback
	rafID = window.requestAnimationFrame(drawLoop);
}

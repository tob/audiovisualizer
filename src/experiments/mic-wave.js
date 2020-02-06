let canvasContext = null;
window.onload = function() {
  "use strict";
  var paths = document.getElementsByTagName("path");
  var h = document.getElementsByTagName("h1")[0];
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContext = canvas.getContext("2d");
  let counter = 0;

  const getXpos = (colNumber, i) => {
    let position = canvas.width / 2;

    if (Math.floor(i / colNumber) > 0) {
      position = (canvas.width / colNumber) * (i % colNumber);
    }

    if (i <= colNumber) {
      position = (canvas.width / colNumber) * i;
    }

    return position;
  };

  var soundAllowed = function(stream) {
    //Audio stops listening in FF without // window.persistAudioStream = stream;
    //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
    //https://support.mozilla.org/en-US/questions/984179
    window.persistAudioStream = stream;
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;

    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    // visualizer.setAttribute("viewBox", "0 0 255 255");
    //
    // //Through the frequencyArray has a length longer than 255, there seems to be no
    // //significant data after this point. Not worth visualizing.
    // for (var i = 0; i < 255; i++) {
    //   path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //   // path.setAttribute('stroke-dasharray', '4,1');
    //   mask.appendChild(path);
    // }
    //
    // path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // // path.setAttribute('stroke-dasharray', '4,1');
    // mask.appendChild(path);

    const audioBars = ({ i, volume }) => {
      paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + volume);

      if (i < 10) {
        paths[i].setAttribute("fill", "blue");
        paths[i].setAttribute(
          "d",
          `M ${i},${255 - volume}
      		m ${i}, 0
      a 25,25 0 1,1 10,0
      a 25,25 0 1,1 -10,0`
        );
      } else if (i > 10 && i < 100) {
        paths[i].setAttribute("fill", "grey");

        paths[i].setAttribute(
          "d",
          `M ${i},${255 - volume}
      		L ${i}, ${255 - volume}
          L ${i + 10}, 255
          L ${i}, 255`
        );
      } else {
        paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + volume);
      }

      paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + volume);
    };

    const drawShape = shape => {
      shape(x, y);
    };

    var doDraw = function() {
      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);
      var volume;

      // Get user input
      sensibility =
        255 -
        document.getElementsByClassName("controller__slider-sensibility")[0]
          .value;

      speed = document.getElementsByClassName("controller__slider-speed")[0]
        .value;

      size = document.getElementsByClassName("controller__slider-size")[0]
        .value;

      const grid =
        document.getElementsByClassName("controller__slider-itemsNumber")[0]
          .value || 15;

      let colorWell = hexToRGB(
        document.getElementById("controller__slider-color").value.replace("#", "0x")
      );

      let opacity = document.getElementsByClassName(
        "controller__slider-opacity"
      )[0].value;

      // For each frequency draw something
      for (let i = 0; i < 255; i++) {
        volume =
          Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);

        // audioBars({ i, volume });

        updateOpacity();
        let customColor2 = `rgb(
          ${colorWell.r - volume},
          ${colorWell.g - volume},
          ${colorWell.b - volume}, 
          ${(opacity * volume) / 255})`;

        let customColor = `rgb(
          ${colorWell.r + volume},
          ${colorWell.g + volume},
          ${colorWell.b + volume}, 
          ${(opacity * volume) / 255})`;

        canvasContext.fillStyle = customColor2;

        const circle = props => drawCircle({ ...props });
        const triangle = props => drawTriangle({ ...props });
        const spiral = props => drawSpiral({ ...props });
        const shapes = [drawCircle, drawTriangle, drawSpiral];

        const shapeProps = {
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          volume: volume * size,
          width: 2,
          speed: 2,
          offset: 10,
          style: customColor,
          stroke: true
        };

        // // Update background based on sensibility
        // if (i === 1 && volume < sensibility / 2) {
        //   canvasContext.fillStyle = "black";
        //   canvasContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
        // }
        // if (i > 30 && volume > sensibility) {
        //   canvasContext.fillStyle = "white";
        //   canvasContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
        // }

        // draw background
        if (
          document.getElementsByClassName("controller__slider-background")[0]
            .checked
        ) {
          volume =
            Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);

          // colorWell
          canvasContext.fillStyle = customColor;
          canvasContext.fillRect(
            getXpos(grid, i) - (volume * size) / 2 + canvas.width / grid / 2,
            (canvas.height / grid) * Math.floor(i / grid) -
              (volume * size) / 2 +
              canvas.height / grid / 2,
            volume * size,
            volume * size
          );
        }

        // draw rotating circles
        if (
          document.getElementsByClassName("controller__slider-rotate")[0]
            .checked
        ) {
          rotate({
            x: canvas.width / 2,
            y: canvas.height / 2,
            drawShape: () =>
              shapes[0]({
                x: circlePos(size * 10, volume, i).width,
                y: circlePos(size * 10, volume, i).height,
                ctx: canvasContext,
                radius: 1,
                volume: volume,
                i: i,
                style: customColor,
                stroke: "black"
              }),
            degree: counter,
            clockwise: false
          });

          rotate({
            x: canvas.width / 2,
            y: canvas.height / 2,
            drawShape: () =>
              shapes[0]({
                x: circlePos(size * 15, volume, i).width,
                y: circlePos(size * 15, volume, i).height,
                ctx: canvasContext,
                radius: 1,
                volume: volume,
                i: i,
                style: customColor2,
                stroke: "black"
              }),
            degree: counter,
            clockwise: true
          });
        }

        // Spiral
        if (
          document.getElementsByClassName("controller__slider-spiral")[0]
            .checked
        ) {
          // shapes[2]({
          //   ctx: canvasContext,
          //   volume: volume,
          //   radius: 1,
          //   i: i
          // });
          shapes[0]({
            x: circlePos(size * 10, volume, i).width + canvas.width / 2,
            y:
              circlePos(size * 10 + volume, volume, i).height +
              canvas.height / 2,
            ctx: canvasContext,
            radius: 1,
            volume: volume,
            i: i,
            style: customColor2,
            stroke: "black"
          });
        }

        // Triangle
        if (
          document.getElementsByClassName("controller__slider-triangle")[0]
            .checked
        ) {
          shapes[1](shapeProps);
        }

        if (counter >= 360) {
          counter = 0;
        }
        counter += volume > 0 ? volume / (10000000 / speed) : 0;

        canvasContext.globalCompositeOperation =
          document.getElementsByClassName("controller__select")[0].value ||
          "difference";
      }
    };
    doDraw();
  };

  var soundNotAllowed = function(error) {
    h.innerHTML = "You must allow your microphone.";
    console.log(error);
  };

  /*window.navigator = window.navigator || {};
	/*navigator.getUserMedia =  navigator.getUserMedia       ||
														navigator.webkitGetUserMedia ||
														navigator.mozGetUserMedia    ||
														null;*/
  navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
};

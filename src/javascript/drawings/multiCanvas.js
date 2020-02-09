const updateControllersValues = index => {
  const ranges = {
    bass: {
      min: 0,
      max: 50
    },
    "bug-FIXME": {
      min: 50,
      max: 100
    },
    tenor: {
      min: 100,
      max: 150
    },
    alto: {
      min: 150,
      max: 200
    },
    soprano: {
      min: 200,
      max: 255
    },
    all: {
      min: 0,
      max: 255
    }
  };

  const canvas = document.getElementsByClassName(
    `canvas-${
      document.getElementsByClassName(`controller__select-canvas-${index}`)[0]
        .value
    }`
  )[0];
  const canvasContext = canvas.getContext("2d");

  const effect = document.getElementsByClassName(
    `controller__select-effect-${index}`
  )[0].value;

  const range =
    document.getElementsByClassName(`controller__select-range-${index}`)[0]
      .value || "all";
  const frequencyMin = ranges[range].min;
  const frequencyMax = ranges[range].max;

  // Get user input
  const rotationSpeed = document.getElementsByClassName(
    `controller__slider-rotationSpeed-${index}`
  )[0].value;

  const size = document.getElementsByClassName(
    `controller__slider-size-${index}`
  )[0].value;

  const twist = document.getElementsByClassName(
    `controller__slider-twist-${index}`
  )[0].checked;

  const stroke = document.getElementsByClassName(
    `controller__slider-stroke-${index}`
  )[0].checked;

  let colorWell = hexToRGB(
    document
      .getElementsByClassName(`controller__slider-color-${index}`)[0]
      .value.replace("#", "0x")
  );

  let opacity = document.getElementsByClassName(
    `controller__slider-opacity-${index}`
  )[0].value;
  return {
    frequencyMin,
    frequencyMax,
    rotationSpeed,
    size,
    colorWell,
    opacity,
    twist,
    stroke,
    effect,
    canvasContext,
    canvas
  };
};

function startAudioVisual() {
  "use strict";

  const soundAllowed = function(stream) {
    //Audio stops listening in FF without // window.persistAudioStream = stream;
    //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
    //https://support.mozilla.org/en-US/questions/984179
    window.persistAudioStream = stream;
    const audioContent = new AudioContext();
    const audioStream = audioContent.createMediaStreamSource(stream);
    const analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;

    const frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    const angles = {};
    let volume;

    var doDraw = function() {
      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);

      const settings = Array.prototype.slice.apply(
        document.getElementsByClassName("container-buttons")
      );

      // Clear All Canvas before mapping settings again to draw.
      // this prevent settings deleting each other.
      settings.map((setting, i) => {
        i++;
        let canvas = document.getElementsByClassName(
          `canvas-${
            document.getElementsByClassName(`controller__select-canvas-${i}`)[0]
              .value
          }`
        )[0];
        let ctx = canvas.getContext("2d");
        const clear = document.getElementsByClassName(
          `controller__slider-clear-${i}`
        )[0].checked;
        clear && ctx.clearRect(0, 0, canvas.width, canvas.height);
      });

      // For each setting do a drawing
      settings.map((setting, index) => {
        index++;

        let {
          frequencyMin,
          frequencyMax,
          rotationSpeed,
          size,
          colorWell,
          opacity,
          twist,
          stroke,
          effect,
          canvas,
          canvasContext
        } = updateControllersValues(index);

        canvasContext.globalCompositeOperation = effect;

        rotate({
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          degree: rotationSpeed/1 === 0 ? 0 : angles[`canvas${index}`],
          drawShape: () => {
            // For each frequency draw something
            for (let i = frequencyMin; i < frequencyMax; i++) {
              volume =
                Math.floor(frequencyArray[i]) -
                (Math.floor(frequencyArray[i]) % 5);

              let customColor = `rgb(
          ${colorWell.r + volume},
          ${colorWell.g + volume},
          ${colorWell.b + volume},
          ${opacity / 100})`;

              setting.style.backgroundColor = customColor;

              pattern({
                ctx: canvasContext,
                canvas: canvas,
                radius: (volume / 5) * size,
                width: (volume / 5) * size,
                volume,
                i,
                mode:
                  document.getElementsByClassName(
                    `controller__select-pattern-${index}`
                  )[0].value || "circle",
                twist,
                shape: (x, y) =>
                  drawShape({
                    x: x,
                    y: y,
                    ctx: canvasContext,
                    width: (volume / 5) * size,
                    mode:
                      document.getElementsByClassName(
                        `controller__select-shape-${index}`
                      )[0].value || "circle",
                    i,
                    style: customColor,
                    stroke: stroke
                  })
              });
            }
          }
        });
        if (angles[`canvas${index}`] >= 360) {
          angles[`canvas${index}`] = 0;
        }

        if (angles[`canvas${index}`]) {
          angles[`canvas${index}`] += (volume * rotationSpeed) / 10000;
        } else {
          angles[`canvas${index}`] = 0.1;
        }
      });
    };

    doDraw();
  };

  const soundNotAllowed = function(error) {
    console.log(error);
  };

  /*window.navigator = window.navigator || {};
	/*navigator.getUserMedia =  navigator.getUserMedia       ||
														navigator.webkitGetUserMedia ||
														navigator.mozGetUserMedia    ||
														null;*/
  navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
}

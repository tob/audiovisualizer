const updateControllersValues = setting => {
  const ranges = {
    "low bass": {
      min: 0,
      max: 50
    },
    bass: {
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

  const canvas = document.getElementsByClassName(`canvas-1`)[0];
  const canvasContext = canvas.getContext("2d");

  // Make a function to do this
  const effect = setting.children[7].children[1].children[0].value;
  const range = setting.children[0].children[1].children[0].value;
  const frequencyMin = ranges[range].min;
  const frequencyMax = ranges[range].max;
  const pattern = setting.children[1].children[1].children[0].value;
  let shape = setting.children[2].children[1].children[0].value;
  const size = setting.children[3].children[1].children[0].value;
  const stroke = setting.children[4].children[1].children[0].checked;
  const color = setting.children[5].children[1].children[0].value;
  let colorWell = hexToRGB(color.replace("#", "0x"));
  let opacity = setting.children[6].children[1].children[0].value;
  const twist = setting.children[8].children[1].children[0].checked;
  const rotationSpeed = setting.children[9].children[1].children[0].value;
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
    canvas,
    pattern,
    color,
    shape,
    range
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
    analyser.fftSize = 512;

    const unitArray = new Uint8Array(analyser.frequencyBinCount).filter((freq, index) => index < 200);
    const lowBassFreq = unitArray.filter((freq, index) => index < unitArray.length/5)
    const bassFreq = unitArray.filter((freq, index) => index < unitArray.length/4)
    const tenorFreq = unitArray.filter((freq, index) => index < unitArray.length/3)
    const altoFreq = unitArray.filter((freq, index) => index < unitArray.length/2)
    const sopranoFreq = unitArray.filter((freq, index) => index < unitArray.length)

    const frequencyArray = new Uint8Array(unitArray.length)
    frequencyArray.set(lowBassFreq)
    frequencyArray.set(bassFreq, lowBassFreq.length)
    frequencyArray.set(tenorFreq, bassFreq.length)
    frequencyArray.set(altoFreq, tenorFreq.length)
    frequencyArray.set(tenorFreq, sopranoFreq.length)
    console.log("unit ARR-", unitArray);
    console.log("freq ARR-", frequencyArray);
    const state = {
      angles: {},
      prevColorWell: null,
      data: { search_params: new URLSearchParams(window.location.search) }
    };
    let volume;

    var doDraw = function() {
      if (!listening) {
        console.log("STOP DRAW");
        return;
      }

      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);

      const settings = Array.prototype.slice.apply(
        document.getElementsByClassName("container-buttons")
      );

      // Clear the canvas if option checked
      const clearCanvas = document.getElementsByClassName(
        `controller__clear`
      )[0].checked;
      if (clearCanvas) {
        const canvases = Array.prototype.slice.apply(
          document.getElementsByTagName("canvas")
        );
        //
        // // Clear All Canvas before mapping settings again to draw.
        // // this prevent settings deleting each other.
        // settings.map((setting, i) => {
        //   i++;
        //   let canvas = document.getElementsByClassName(
        //     `canvas-${
        //       document.getElementsByClassName(`controller__select-canvas-${i}`)[0]
        //         .value
        //     }`
        //   )[0];
        //   let ctx = canvas.getContext("2d");
        //   const clear = document.getElementsByClassName(
        //     `controller__slider-clear-${i}`
        //   )[0].checked;
        //   clear && ctx.clearRect(0, 0, canvas.width, canvas.height);
        // });
        //
        canvases.map(canvas => {
          let ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }

      // For each setting do a drawing
      settings.map((setting, index) => {
        index++;

        let data = updateControllersValues(setting, index);

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
          canvasContext,
          pattern,
          shape
        } = data;

        let { angles } = state;

        canvasContext.globalCompositeOperation = effect;

        // update color of settings bar if necessary
        if (colorWell !== state.prevColorWell) {
          state.prevColorWell = colorWell;
          setting.style.backgroundColor = `rgb(${colorWell.r},${colorWell.g},${colorWell.b}, 100)`;
        }

        // rotate the full canvas
        rotate({
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          degree: rotationSpeed / 1 === 0 ? 0 : angles[`canvas${index}`],
          drawShape: () => {
            // For each frequency draw something
            for (let i = frequencyMin; i < frequencyMax; i++) {
              volume = Math.floor(frequencyArray[i]);

              let customColor = `rgb(
              ${colorWell.r + volume},
              ${colorWell.g + volume},
              ${colorWell.b + volume},
              ${opacity / 100})`;

              drawPattern({
                ctx: canvasContext,
                canvas: canvas,
                radius: (canvas.width / 100) * size + volume,
                size: size,
                volume,
                i,
                mode: pattern,
                width: (volume / 5) * size,
                twist,
                arrayLength: frequencyMax - frequencyMin,
                shape: (x, y) =>
                  drawShape({
                    x: x,
                    y: y,
                    ctx: canvasContext,
                    width: (volume / 5) * size,
                    mode: shape,
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

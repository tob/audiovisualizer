import { rotate } from "../helpers/transform.js";
import { listening,hexToRGB } from "../utils/setup-canvas.js";
import { drawPattern, drawShape } from "../helpers/shapes.js";


const RANGES = {
  "low bass": {
    min: 0,
    max: 50,
  },
  bass: {
    min: 50,
    max: 100,
  },
  tenor: {
    min: 100,
    max: 150,
  },
  alto: {
    min: 150,
    max: 200,
  },
  soprano: {
    min: 200,
    max: 255,
  },
  all: {
    min: 0,
    max: 255,
  },
};

function clearCanvas() {
  const clearCanvas = document.querySelector(`.controller__clear`).checked;
  if (!clearCanvas) return;

  const canvases = Array.prototype.slice.apply(
    document.getElementsByTagName("canvas")
  );

  canvases.map((canvas) => {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

const updateControllersValues = (layer) => {
  const canvas = document.getElementsByClassName(`canvas-1`)[0];
  const canvasContext = canvas.getContext("2d");

  // Make a function to do this by using classnames selectors
  const effect = layer.children[7].children[1].children[0].value;
  const range = layer.children[0].children[1].children[0].value;
  const frequencyMin = RANGES[range].min;
  const frequencyMax = RANGES[range].max;
  const pattern = layer.children[1].children[1].children[0].value;
  let shape = layer.children[2].children[1].children[0].value;
  const size = layer.children[3].children[1].children[0].value;
  const stroke = layer.children[4].children[1].children[0].checked;
  const color = layer.children[5].children[1].children[0].value;
  let colorWell = hexToRGB(color.replace("#", "0x"));
  let opacity = layer.children[6].children[1].children[0].value;
  const twist = layer.children[8].children[1].children[0].checked;
  const rotationSpeed = layer.children[9].children[1].children[0].value;
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
    range,
  };
};

function getAudioInput(stream) {
  window.persistAudioStream = stream;
  const audioContent = new AudioContext();
  const audioStream = audioContent.createMediaStreamSource(stream);
  const analyser = audioContent.createAnalyser();
  audioStream.connect(analyser);
  analyser.fftSize = 512;

  // filter out frequencies that hardly get used
  const unitArray = new Uint8Array(analyser.frequencyBinCount).filter(
    (freq, index) => index < 255
  );

  // creating a new typed array for performance reasons
  const frequencyArray = new Uint8Array(unitArray.length);

  // slice source input in frequencies
  // fill the typed array
  const module = unitArray.length / 5;
  frequencyArray.set(unitArray.slice(0, module));
  frequencyArray.set(unitArray.slice(module, module * 2), module);
  frequencyArray.set(unitArray.slice(module * 2, module * 3), module * 2);
  frequencyArray.set(unitArray.slice(module * 3, module * 4), module * 3);
  frequencyArray.set(unitArray.slice(module * 4, unitArray.length), module * 4);

  return { analyser, frequencyArray };
}

function startAudioVisual() {
  "use strict";

  const soundAllowed = function (stream) {
    const { analyser, frequencyArray } = getAudioInput(stream);
    const state = {
      angles: {},
      prevColorWell: null,
      data: { search_params: new URLSearchParams(window.location.search) },
    };
    let volume;

    function doDraw() {
      if (!listening) {
        console.log("STOP DRAW");
        return;
      }

      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);

      const layers = Array.prototype.slice.apply(
        document.getElementsByClassName("container-buttons")
      );

      // Clear the canvas if option checked
      clearCanvas();

      // For each layer do a drawing
      layers.map((layer, index) => {
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
          canvasContext,
          pattern,
          shape,
        } = updateControllersValues(layer, index);

        let { angles } = state;

        canvasContext.globalCompositeOperation = effect;

        // update color of layer bar if necessary
        if (colorWell !== state.prevColorWell) {
          state.prevColorWell = colorWell;
          layer.style.backgroundColor = `rgb(${colorWell.r},${colorWell.g},${colorWell.b}, 100)`;
        }

        // rotate the full canvas
        rotate({
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          degree: rotationSpeed / 1 === 0 ? 0 : angles[`canvas${index}`],
          draw: () => {
            // For each frequency in range draw something
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
                    stroke: stroke,
                  }),
              });
            }
          },
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
    }

    doDraw();
  };

  const soundNotAllowed = function (error) {
    console.log(error);
  };

  /*window.navigator = window.navigator || {};
	/*navigator.getUserMedia =  navigator.getUserMedia       ||
														navigator.webkitGetUserMedia ||
														navigator.mozGetUserMedia    ||
														null;*/
  navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
}


export {
  startAudioVisual,

}
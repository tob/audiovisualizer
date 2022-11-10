import { rotate } from "../helpers/transform.js";
import { settings, RANGES } from "../utils/layer-settings.js";
import { drawPattern, drawShape } from "../helpers/shapes.js";
import { getAverageValue } from "../helpers/math.js";
import { hexToRGB } from "../utils/colors.js";
import { getAudioInput } from "../utils/microphone.js";

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
  const color = layer.children[5].children[1].children[0].value;
  const colorWell = hexToRGB(color.replace("#", "0x"));
  const effect = layer.children[7].children[1].children[0].value;

  const opacity = layer.children[6].children[1].children[0].value;

  const pattern = layer.children[1].children[1].children[0].value;
  const range = layer.children[0].children[1].children[0].value;
  const rotationSpeed = layer.children[9].children[1].children[0].value;
  const shape = layer.children[2].children[1].children[0].value;
  const size = layer.children[3].children[1].children[0].value;
  const stroke = layer.children[4].children[1].children[0].checked;
  const twist = layer.children[8].children[1].children[0].checked;

  const rangeStart = RANGES[range].min;
  const rangeEnd = RANGES[range].max;
  return {
    rangeStart,
    rangeEnd,
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

function startAudioVisual() {
  "use strict";

  const soundAllowed = function (stream) {
    const { analyser, frequencyArray } = getAudioInput(stream);
    const state = {
      canvas1: {
        angles: 0,
        prevColorWell: null,
        prevAverage: 0,
        prevPattern: "center",
        currentPattern: "center",
      },

      data: { search_params: new URLSearchParams(window.location.search) },
    };
    let volume;

    function doDraw() {
      if (!window.listening) {
        console.log("STOP DRAW");
        return;
      }
      const fps = 24;
      setTimeout(() => {
        requestAnimationFrame(doDraw);
      }, 1000 / fps);
      // requestAnimationFrame(doDraw);
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
          rangeStart,
          rangeEnd,
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

        const canvasState = state[`canvas${index}`];
        canvasContext.globalCompositeOperation = effect;

        const averageVolume = getAverageValue(frequencyArray);
        if (
          (pattern === "random" &&
            averageVolume - canvasState.prevAverage >= 5) ||
          (pattern === "random" && canvasState.prevPattern !== "random")
        ) {
          const filteredPattern = settings.pattern.list.filter(
            (value) => value !== "random"
          );

          (state[`canvas${index}`].currentPattern =
            filteredPattern[
              Math.floor(Math.random() * filteredPattern.length)
            ]),
            (state[`canvas${index}`].prevPattern = pattern);
        } else if (
          pattern !== "random"
        ) {
          state[`canvas${index}`] = {
            ...canvasState,
            prevPattern: pattern,
            currentPattern: pattern,
            prevAverage: averageVolume,
          };
        }
        // update color of layer bar if necessary
        if (colorWell !== canvasState?.prevColorWell) {
          state[`canvas${index}`].prevColorWell = colorWell;

          layer.style.backgroundColor = `rgb(${colorWell.r},${colorWell.g},${colorWell.b}, 100)`;
        }

        // rotate the full canvas
        rotate({
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          degree: rotationSpeed / 1 === 0 ? 0 : state[`canvas${index}`].angles,
          draw: () => {
            // For each frequency in range draw something
            const startIndex = Math.round(rangeStart * frequencyArray.length);
            const stopIndex = Math.round(rangeEnd * frequencyArray.length);
            for (
              let i = { position: startIndex, counter: 0 };
              i.counter < stopIndex && i.counter <= frequencyArray.length;
              i.counter++
            ) {
              volume = Math.floor(frequencyArray[i.position]);
              i.position++;

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
                i: i.counter,
                mode: state[`canvas${index}`].currentPattern,
                width: (volume / 5) * size,
                twist,
                arrayLength: stopIndex - startIndex,
                shape: (x, y) =>
                  drawShape({
                    x: x,
                    y: y,
                    ctx: canvasContext,
                    width: (volume / 5) * size,
                    mode: shape,
                    i: i.counter,
                    style: customColor,
                    stroke: stroke,
                  }),
              });
            }
          },
        });
        if (canvasState?.angles >= 360) {
          state[`canvas${index}`].angles = 0;
        }

        if (canvasState?.angles > 0) {
          state[`canvas${index}`].angles +=
            (state[`canvas${index}`].prevAverage * rotationSpeed) / 10000;
        } else {
          state[`canvas${index}`].angles = 0.1;
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

export { startAudioVisual };

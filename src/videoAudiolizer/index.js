import { rotate, updateAngles } from "../javascript/utils/transform.js";
import {
  settings,
  updateControllersValues,
} from "../javascript/utils/layer-settings.js";
import { getPatternXy, drawShape } from "../javascript/drawings/shapes.js";
import { getAverageValue } from "../javascript/utils/math.js";
import { getAudioInput } from "../javascript/utils/microphone.js";
import { images } from "../javascript/index.js";

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

function startAudioVisual() {
  "use strict";

  const soundAllowed = function (stream) {
    const { analyser, frequencyArray } = getAudioInput(stream);
    const state = {
      canvas1: {
        asset: 1,
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
      const fps = 16;
      setTimeout(() => {
        requestAnimationFrame(doDraw);
      }, 1000 / fps);
      // requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);

      // create an array from the html elements with classname container-buttons
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
        const newAsset =
          canvasState.asset !== images.length ? canvasState.asset + 1 : 1;
        state[`canvas${index}`].asset = newAsset;
        canvasContext.globalCompositeOperation = effect;
        const averageVolume = getAverageValue(frequencyArray);

        const triggerRandom =
          (pattern === "random" &&
            averageVolume - canvasState.prevAverage >= 5) ||
          (pattern === "random" && canvasState.prevPattern !== "random");

        if (triggerRandom) {
          const filteredPattern = settings.pattern.list.filter(
            (value) => value !== "random"
          );

          state[`canvas${index}`] = {
            ...canvasState,
            currentPattern:
              filteredPattern[
                Math.floor(Math.random() * filteredPattern.length)
              ],
            prevPattern: pattern,
            asset: newAsset,
          };
        } else if (pattern !== "random") {
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

        let customColor = `rgb(
          ${colorWell.r + volume},
          ${colorWell.g + volume},
          ${colorWell.b + volume},
          ${opacity / 100})`;

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

              const { x: posX, y: posY } = getPatternXy({
                pattern,
                canvas: canvas,
                radius: canvas.width / 100 + volume,
                size: size,
                volume,
                i: i.counter,
                mode: state[`canvas${index}`].currentPattern,
                width: (volume / 5) * size,
                arrayLength: stopIndex - startIndex,
                asset: newAsset,
              });

              rotate({
                x: posX,
                y: posY,
                degree: twist && canvasState.angles + i.counter, // kaleidoscope effect << !!!!!
                ctx: canvasContext,
                draw: () => {
                  drawShape({
                    x: posX,
                    y: posY,
                    ctx: canvasContext,
                    width: (volume / 5) * size,
                    mode: shape,
                    i: i.counter,
                    stroke: stroke,
                    fill: customColor,
                    asset: canvasState.asset,
                  });
                },
              });
            }
          },
        });

        const newAngles = updateAngles({
          angles: canvasState.angles,
          prevAverage: state[`canvas${index}`].prevAverage,
          rotationSpeed,
        });

        state[`canvas${index}`].angles = newAngles;
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

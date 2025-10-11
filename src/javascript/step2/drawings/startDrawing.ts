import { rotate, updateAngles } from "../../utils/transform";
import { settings, updateControllersValues } from "../../utils/layer-settings";
import { getPatternXy, drawShape, applyStyle } from "./shapes";
import { getAverageValue } from "../../utils/math";
import { audioSourceManager } from "../../audio/AudioSourceManager";
import { getInputElement } from "../../utils/dom-helpers";

function clearCanvas() {
  const el = getInputElement(`.controller__clear`);
  const clearCanvas = el?.checked ?? false;
  if (!clearCanvas) return;

  const canvases = Array.prototype.slice.apply(
    document.getElementsByTagName("canvas")
  );

  canvases.map((canvas) => {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

// Track if visualization is already running
let isRunning = false;
let currentAnimationId: number | null = null;
let currentTimeoutId: number | null = null;
let currentObserver: MutationObserver | null = null;

function startAudioVisual() {
  "use strict";

  // Don't start if already running
  if (isRunning) {
    console.log('Visualization already running');
    return;
  }

  isRunning = true;

  const soundAllowed = function () {
    // Get analyzer from the audio source manager
    const analyzerResult = audioSourceManager.getAnalyzerResult();
    if (!analyzerResult) {
      console.error('No audio analyzer available. Make sure an audio source is started first.');
      isRunning = false;
      return;
    }

    const { analyser, frequencyArray } = analyzerResult;

    // Debug: Check canvas size at start
    const allCanvases = document.querySelectorAll('canvas');
    console.log(`Starting visualization - Found ${allCanvases.length} canvas(es), Window: ${window.innerWidth}x${window.innerHeight}`);
    allCanvases.forEach((canvas, i) => {
      const htmlCanvas = canvas as HTMLCanvasElement;
      console.log(`Canvas ${i+1}: ${htmlCanvas.width}x${htmlCanvas.height}`);
    });
    const state = {
      canvas1: {
        angles: 0,
        prevColorWell: null,
        prevAverage: 0,
        prevPattern: "center",
        currentPattern: "center",
      },
      canvas2: {
        angles: 360,
        prevColorWell: null,
        prevAverage: 0,
        prevPattern: "center",
        currentPattern: "center",
      },

      data: { search_params: new URLSearchParams(window.location.search) },
    };
    let volume;

    // Cache layers array and update when DOM changes
    let cachedLayers = Array.prototype.slice.apply(
      document.getElementsByClassName("container-buttons")
    );

    // Watch for layer additions/removals/reordering
    const controlBoard = document.getElementById("controlboard");
    if (controlBoard) {
      // Disconnect previous observer if exists
      if (currentObserver) {
        currentObserver.disconnect();
      }
      currentObserver = new MutationObserver(() => {
        cachedLayers = Array.prototype.slice.apply(
          document.getElementsByClassName("container-buttons")
        );
      });
      currentObserver.observe(controlBoard, { childList: true });
    }

    function doDraw() {
      if (!window.listening || !isRunning) {
        console.log("STOP DRAW");
        isRunning = false;
        return;
      }
      const fps = 30; // Increased from 16 for smoother animations
      currentTimeoutId = window.setTimeout(() => {
        currentAnimationId = requestAnimationFrame(doDraw);
      }, 1000 / fps);
      // requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);

      // Use cached layers array (updated by MutationObserver)
      const layers = cachedLayers;

      // Check if any layer uses video fillMode and update webcam visibility
      const hasVideoFill = layers.some((layer) => {
        const layerId = parseInt(layer.getAttribute("data-layer-id") || "1");
        const { fillMode } = updateControllersValues(layer, layerId);
        return fillMode === "video";
      });

      const webcamElement = document.getElementById('webcam');
      if (webcamElement) {
        if (hasVideoFill) {
          webcamElement.classList.add('active');
        } else {
          webcamElement.classList.remove('active');
        }
      }

      // Clear the canvas if option checked
      clearCanvas();

      // Get canvas reference
      const canvas = document.querySelector('.canvas-1') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas not found!');
        return;
      }

      // Draw video FIRST as base layer (before shapes)
      // This ensures video animates properly and shapes effects don't affect it
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Save the current composite operation
        const savedComposite = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'source-over';

        // Draw uploaded video/audio (priority 2)
        const uploadedMedia = document.querySelector('.uploaded-media') as HTMLVideoElement;
        if (uploadedMedia && uploadedMedia instanceof HTMLVideoElement && uploadedMedia.readyState >= 2) {
          ctx.drawImage(uploadedMedia, 0, 0, canvas.width, canvas.height);
        }

        // Draw webcam (priority 1 - highest, draws on top of uploaded media)
        if (hasVideoFill && webcamElement) {
          const webcam = webcamElement as HTMLVideoElement;
          if (webcam.readyState >= 2) {
            ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
          }
        }

        // Restore composite operation
        ctx.globalCompositeOperation = savedComposite;
      }

      // For each layer do a drawing
      layers.map((layer, index) => {
        // Get the original layer ID from data attribute (doesn't change on reorder)
        const layerId = parseInt(layer.getAttribute("data-layer-id") || "1");

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
          fillMode,
        }: any = updateControllersValues(layer, layerId);

        // Initialize state for this layer if it doesn't exist
        if (!state[`canvas${layerId}`]) {
          state[`canvas${layerId}`] = {
            angles: layerId * 60, // Offset initial angles
            prevColorWell: null,
            prevAverage: 0,
            prevPattern: "center",
            currentPattern: "center",
          };
        }

        const canvasState = state[`canvas${layerId}`];
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

          (state[`canvas${layerId}`].currentPattern =
            filteredPattern[
              Math.floor(Math.random() * filteredPattern.length)
            ]),
            (state[`canvas${layerId}`].prevPattern = pattern);
        } else if (pattern !== "random") {
          state[`canvas${layerId}`] = {
            ...canvasState,
            prevPattern: pattern,
            currentPattern: pattern,
            prevAverage: averageVolume,
          };
        }
        // update color of layer bar if necessary
        if (colorWell !== canvasState?.prevColorWell) {
          state[`canvas${layerId}`].prevColorWell = colorWell;

          layer.style.backgroundColor = `rgb(${colorWell.r},${colorWell.g},${colorWell.b}, 100)`;
        }

        // Pre-calculate base color (will be modified per shape with volume)
        const baseR = colorWell.r;
        const baseG = colorWell.g;
        const baseB = colorWell.b;
        const alphaValue = opacity / 100;

        // rotate the full canvas
        rotate({
          ctx: canvasContext,
          x: canvas.width / 2,
          y: canvas.height / 2,
          degree: rotationSpeed / 1 === 0 ? 0 : state[`canvas${layerId}`].angles,
          draw: () => {
            // For each frequency in range draw something
            const startIndex = Math.round(rangeStart * frequencyArray.length);
            const stopIndex = Math.round(rangeEnd * frequencyArray.length);

            // Filter out bins with very low volume (noise)
            // Lower threshold for video files which may have quieter highs
            const minVolume = 5; // Threshold to ignore near-silent bins

            for (
              let i = { position: startIndex, counter: 0 };
              i.counter < stopIndex && i.counter <= frequencyArray.length;
              i.counter++
            ) {
              volume = Math.floor(frequencyArray[i.position]);
              i.position++;

              // Skip if volume is below threshold
              if (volume < minVolume) continue;

              // Calculate color once per shape (not per layer)
              const customColor = `rgb(${baseR + volume},${baseG + volume},${baseB + volume},${alphaValue})`;

              const { x: posX, y: posY } = getPatternXy({
                canvas: canvas,
                radius: canvas.width / 100 + volume,
                size: size,
                volume,
                i: i.counter,
                mode: state[`canvas${layerId}`].currentPattern,
                width: (volume / 5) * size,
                arrayLength: stopIndex - startIndex,
                asset: "", // TO-DO check what is this
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
                    fillMode: fillMode,
                  } as any);
                },
              });
            }
          },
        });

        const newAngles = updateAngles({
          angles: canvasState.angles,
          prevAverage: state[`canvas${layerId}`].prevAverage,
          rotationSpeed,
        });

        state[`canvas${layerId}`].angles = newAngles;
      });
    }

    doDraw();
  };

  // Audio source is already initialized by audioSourceManager
  // Just start the visualization loop
  soundAllowed();
}

function stopAudioVisual() {
  console.log('Stopping visualization...');

  // Set flags to stop loops
  isRunning = false;
  window.listening = false;

  // Cancel pending animation frames and timeouts
  if (currentAnimationId !== null) {
    cancelAnimationFrame(currentAnimationId);
    currentAnimationId = null;
  }

  if (currentTimeoutId !== null) {
    clearTimeout(currentTimeoutId);
    currentTimeoutId = null;
  }

  // Disconnect mutation observer
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }
}

export { startAudioVisual, stopAudioVisual };

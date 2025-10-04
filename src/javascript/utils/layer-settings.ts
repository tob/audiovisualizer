import { hexToRGB } from "../utils/colors";
import { getType } from "../drawings/drawSettings";
import { getCanvasElement, getInputElement, getSelectElement } from "./dom-helpers";

export const settings = {
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["sub bass", "low bass", "bass", "low mid", "mid", "high mid", "all"],
    value: "all",
  },
  slices: {
    icon: "fa-route",
    min: 0,
    max: 50,
    value: 1,
  },
  pattern: {
    icon: "fa-route",
    list: [
      "center",
      "line",
      "verticalLine",
      "spiral",
      "diagonal",
      "grid",
      "wave",
      "verticalWave",
      "circle",
      "cursor",
      "random",
      "clock",
    ],
    value: "line",
  },
  shape: {
    icon: "fa-shapes",
    list: ["triangle", "square", "circle", "star", "ninja"],
    value: "square",
  },
  size: {
    icon: "fa-search-plus",
    min: 0,
    max: 15,
    value: 7,
  },
  stroke: {
    icon: "fa-pen",
    checked: true,
  },
  fillMode: {
    icon: "fa-fill-drip",
    list: ["color", "video"],
    value: "color",
  },
  color: {
    icon: "fa-palette",
    value: "#ff0f22",
  },
  opacity: {
    icon: "fa-eye",
    min: 0,
    max: 100,
    value: 70,
  },
  effect: {
    icon: "fa-chess-board",
    list: [
      "source-over",
      "multiply",
      "lighten",
      "difference",
      "exclusion",
      "color-dodge",
      "luminosity",
      "darken",
      "screen",
      "overlay",
      "xor",
      "copy",
      "destination-atop",
      "destination-over",
      "destination-out",
      "destination-in",
      "source-out",
      "source-in",
      "source-atop",
    ],
    value: "source-over",
  },
  twist: {
    icon: "fa-biohazard",
    checked: true,
  },
  rotationSpeed: {
    icon: "fa-sync",
    min: -10,
    max: 10,
    value: 1,
  },
};

// Frequency ranges optimized for actual audio content
// Most audio energy is concentrated in 20Hz-4kHz (0-50% of spectrum)
// With 48kHz sample rate and 1024 FFT, we get 512 bins covering 0-24kHz
// These ranges focus on where audio actually lives, not empty spectrum
export const RANGES = {
  "sub bass": {
    min: 0,
    max: 0.03,  // ~20-100Hz - kick drums, deep bass
  },
  "low bass": {
    min: 0.03,
    max: 0.08,  // ~100-250Hz - bass guitar, low vocals
  },
  "bass": {
    min: 0.08,
    max: 0.15,  // ~250-500Hz - body of most instruments
  },
  "low mid": {
    min: 0.15,
    max: 0.25,  // ~500-1kHz - warmth, fundamental tones
  },
  "mid": {
    min: 0.25,
    max: 0.35,  // ~1-2kHz - vocals, melody (most important!)
  },
  "high mid": {
    min: 0.35,
    max: 0.5,   // ~2-4kHz - presence, clarity
  },
  "all": {
    min: 0,
    max: 1,
  },
};

export const updateControllersValues = (layer, index) => {
  const result: any = {};

  // Use cached input elements if available (huge performance boost)
  const inputCache = (layer as any).__inputCache;

  if (inputCache) {
    // Fast path: use cached elements (no DOM queries)
    for (const [key, value] of Object.entries(settings)) {
      const type = getType(settings[key]);
      const input = inputCache[key];

      if (!input) continue;

      switch (type) {
        case "color":
          result["colorWell"] = hexToRGB(
            input.value.replace("#", "0x")
          );
          break;

        case "number":
          result[key] = input.value;
          break;

        case "select":
          result[key] = input.value;
          break;

        case "checkbox":
          result[key] = input.checked;
          break;

        default:
          break;
      }
    }
  } else {
    // Fallback path: query DOM (slow, only for old layers)
    for (const [key, value] of Object.entries(settings)) {
      const type = getType(settings[key]);

      switch (type) {
        case "color":
          result["colorWell"] = hexToRGB(
            getInputElement(
              `.controller__slider-${key}-${index}`
            ).value.replace("#", "0x")
          );
          break;

        case "number":
          result[key] = getInputElement(
            `.controller__slider-${key}-${index}`
          ).value;
          break;

        case "select":
          result[key] = getSelectElement(
            `.controller__select-${key}-${index}`
          ).value;
          break;

        case "checkbox":
          result[key] = getInputElement(
            `.controller__slider-${key}-${index}`
          ).checked;
          break;

        default:
          break;
      }
    }
  }

  const rangeStart = RANGES[result.range].min;
  const rangeEnd = RANGES[result.range].max;

  // hardcoded 1 instead of {index} because using always the same canvas
  const canvas = getCanvasElement(`.canvas-1`);
  const canvasContext = canvas.getContext("2d");
  

  return {
    rangeStart,
    rangeEnd,
    canvas,
    canvasContext,
    ...result,
  };
};

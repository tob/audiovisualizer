import { hexToRGB } from "../utils/colors.js";
import { getType } from "../drawings/drawSettings.js";

export const settings = {
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["low bass", "bass", "tenor", "alto", "soprano", "all"],
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

export const RANGES = {
  "low bass": {
    min: 0,
    max: 0.5,
  },
  bass: {
    min: 0.5,
    max: 0.15,
  },
  tenor: {
    min: 0.15,
    max: 0.3,
  },
  alto: {
    min: 0.3,
    max: 0.5,
  },
  soprano: {
    min: 0.5,
    max: 1,
  },
  all: {
    min: 0,
    max: 1,
  },
};

export const updateControllersValues = (layer, index) => {
  const result = {};
  for (const [key, value] of Object.entries(settings)) {
    const type = getType(settings[key]);

    switch (type) {
      case "color":
        result["colorWell"] = hexToRGB(
          document
            .getElementsByClassName(`controller__slider-${key}-${index}`)[0]
            .value.replace("#", "0x")
        );

        break;
      case "number":
        result[key] = document.getElementsByClassName(
          `controller__slider-${key}-${index}`
        )[0].value;

        break;
      case "select":
        result[key] = document.getElementsByClassName(
          `controller__select-${key}-${index}`
        )[0].value;
        break;
      case "checkbox":
        result[key] = document.getElementsByClassName(
          `controller__slider-${key}-${index}`
        )[0].checked;
        break;
      default:
        break;
    }
  }

  const rangeStart = RANGES[result.range].min;
  const rangeEnd = RANGES[result.range].max;

  // hardcoded 1 instead of {index} because using always the same canvas
  const canvas = document.getElementsByClassName(`canvas-1`)[0]; 
  const canvasContext = canvas.getContext("2d");

  return {
    rangeStart,
    rangeEnd,
    canvas,
    canvasContext,
    ...result,
  };
};

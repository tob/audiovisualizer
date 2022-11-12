import { hexToRGB } from "../utils/colors.js";

export const settings = {
  range: {
    icon: "fa-assistive-listening-systems",
    list: ["low bass", "bass", "tenor", "alto", "soprano", "all"],
    value: "all",
  },
  pattern: {
    icon: "fa-route",
    list: [
      "center",
      "line",
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

export const updateControllersValues = (layer) => {
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

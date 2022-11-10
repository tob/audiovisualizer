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

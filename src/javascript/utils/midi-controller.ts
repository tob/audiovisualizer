import { getIndexFromValue, getPercentage } from "./math";
import { hexToRGB, rgbToHex } from "./colors";
import { getInputElement, getSelectElement } from "./dom-helpers";
import { settings } from "./layer-settings";
export function connectMidi() {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }
  }

  function getMIDIMessage(midiMessage) {
    const control = midiMessage.data[1];
    const value = midiMessage.data[2];
    if (!control) return;
    const colorWell = getInputElement(".controller__slider-color-1");
    const color = hexToRGB(colorWell.value.replace("#", "0x"));
    let newHex = colorWell.value;
    switch (control) {
      case 3:
        const rangeControl = getSelectElement(
          ".controller__select-range-1"
        );
        const ranges = settings.range.list;
        rangeControl.value =
          ranges[getIndexFromValue(ranges.length - 1, value)];
        // const size = document.querySelector(".controller__slider-size-1");
        // size.value = value / 10;
        break;
      case 4:
        const patternControl = getSelectElement(
          ".controller__select-pattern-1"
        );
        const patterns = settings.pattern.list;
        patternControl.value =
          patterns[getIndexFromValue(patterns.length - 1, value)];
        break;
      case 5:
        const shape = getSelectElement(".controller__select-shape-1");
        const shapes = settings.shape.list;
        shape.value = shapes[getIndexFromValue(shapes.length - 1, value)];
        break;
      case 6:
        // const shape = document.querySelector(".controller__select-shape-1");
        // const shapes = settings.shape.list;
        // shape.value = shapes[Math.round(shapes.length * ((1 / 127) * value))];
        // console.log(shapes.length * ((1 / 127) * value));
        break;
      case 14:
        const red = Math.round((255 / 100) * getPercentage(127, value));
        newHex = rgbToHex(red, color.g, color.b);
        colorWell.value = newHex;
        break;
      case 15:
        const green = Math.round((255 / 100) * getPercentage(127, value));
        newHex = rgbToHex(color.r, green, color.b);
        colorWell.value = newHex;

        break;
      case 16:
        const blue = Math.round((255 / 100) * getPercentage(127, value));
        newHex = rgbToHex(color.r, color.g, blue);
        colorWell.value = newHex;

        break;
      default:
        break;
    }

    console.log({ control, value });
  }

  function onMIDIFailure() {
    console.log("Could not access your MIDI devices.");
  }
}

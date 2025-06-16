export function getInputElement(selector: string): HTMLInputElement {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`No element found for selector: ${selector}`);
  }
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Element '${selector}' is not an HTMLInputElement`);
  }
  return el;
}

export function getSelectElement(selector: string): HTMLSelectElement {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`No element found for selector: ${selector}`);
  }
  if (!(el instanceof HTMLSelectElement)) {
    throw new Error(`Element '${selector}' is not an HTMLSelectElement`);
  }
  return el;
}

export function getCheckboxElement(selector: string): HTMLInputElement {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`No element found for selector: ${selector}`);
  }
  if (!(el instanceof HTMLInputElement) || el.type !== "checkbox") {
    throw new Error(`Element '${selector}' is not a checkbox input`);
  }
  return el;
}

export function getVideoElement(selector: string): HTMLVideoElement {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`No element found for selector: ${selector}`);
  }
  if (!(el instanceof HTMLVideoElement)) {
    throw new Error(`Element '${selector}' is not an HTMLVideoElement`);
  }
  return el;
}

export function getCanvasElement(selector: string): HTMLCanvasElement {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`No element found for selector: ${selector}`);
  }
  if (!(el instanceof HTMLCanvasElement)) {
    throw new Error(`Element '${selector}' is not an HTMLCanvasElement`);
  }
  return el;
}

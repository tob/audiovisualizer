export const getType = (setting) => {
  if (setting.max) {
    return "number";
  }

  if (setting.list) {
    return "select";
  }

  if ('checked' in setting) {
    return "checkbox";
  }

  return "color";
};

const createButtons = (parent, settings, i) => {
  // Create draggable layer container
  const containerButtons = document.createElement("div");
  containerButtons.className = "container-buttons";
  containerButtons.draggable = true;
  // Store the layer ID as a data attribute so it persists after reordering
  containerButtons.setAttribute("data-layer-id", i.toString());

  // Cache for storing input element references (for performance)
  const inputCache: any = {};

  parent.appendChild(containerButtons);

  // Control visualization
  for (let setting in settings) {
    const { list, value, min, max, icon, checked } = settings[setting];

    const type = getType(settings[setting]);

    console.log(type);

    const button = document.createElement("span");
    button.className = `controller__button controller__button-${icon}`;
    containerButtons.appendChild(button);

    const settingIcon = document.createElement("i");
    settingIcon.className = `fa ${icon}`;
    button.appendChild(settingIcon);

    const containerInput = document.createElement("label");
    containerInput.className =
      type === "checkbox" ? "controller__switch" : "controller__label";
    button.appendChild(containerInput);

    const input = list
      ? document.createElement("select")
      : document.createElement("input");

    input.setAttribute("type", type);
    input.className = `controller__slider-${setting}-${i}`;
    input.value = value;

    // Store reference to this input element for fast access
    inputCache[setting] = input;

    containerInput.appendChild(input);

    switch (type) {
      case "number": {
        const numberInput = input as HTMLInputElement;
        numberInput.min = min;
        numberInput.max = max || i;
        numberInput.innerText = value;
        break;
      }
      case "checkbox": {
        const checkboxInput = input as HTMLInputElement;
        const toggle = document.createElement("span");
        toggle.className = "controller__toggle";
        containerInput.appendChild(toggle);
        // You likely wanted to set checkboxInput.checked = checked; instead of toggle.checked
        checkboxInput.checked = checked;
        break;
      }
      case "select": {
        const selectInput = input as HTMLSelectElement;
        selectInput.className = `controller__select-${setting}-${i}`;
        list.map((option) => {
          let element = document.createElement("option");
          element.value = option;
          element.innerText = option;
          selectInput.appendChild(element);
        });
        selectInput.selectedIndex = list.indexOf(value);
        break;
      }
    }
  }

  // Store the input cache on the container element for fast retrieval
  (containerButtons as any).__inputCache = inputCache;

  // Add delete button at the end
  const deleteButton = document.createElement("button");
  deleteButton.className = "container-buttons__delete";
  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
  deleteButton.title = "Delete layer";
  deleteButton.addEventListener("click", () => {
    // Only allow deletion if there's more than one layer
    const totalLayers = document.getElementsByClassName("container-buttons").length;
    if (totalLayers <= 1) {
      alert("Cannot delete the last layer. At least one layer is required.");
      return;
    }

    // Confirm deletion
    if (confirm("Are you sure you want to delete this layer?")) {
      containerButtons.remove();
    }
  });
  containerButtons.appendChild(deleteButton);
};

// Global function to resize all canvases to match window size
const resizeAllCanvases = () => {
  const canvases = document.querySelectorAll('canvas');
  const width = window.innerWidth;
  const height = window.innerHeight;

  console.log(`[RESIZE] Window: ${width}x${height}, Found ${canvases.length} canvas(es)`);

  canvases.forEach((canvas) => {
    const htmlCanvas = canvas as HTMLCanvasElement;
    console.log(`[RESIZE] Canvas ${htmlCanvas.className} before: ${htmlCanvas.width}x${htmlCanvas.height}`);
    htmlCanvas.width = width;
    htmlCanvas.height = height;
    console.log(`[RESIZE] Canvas ${htmlCanvas.className} after: ${htmlCanvas.width}x${htmlCanvas.height}`);
  });
};

const addCanvas = (main) => {
  const ctx = document.createElement("canvas");
  const i =
    Array.prototype.slice.apply(document.getElementsByTagName("canvas"))
      .length + 1 || 1;
  ctx.className = `canvas-${i}`;
  ctx.id = "canvas";

  // Set canvas size IMMEDIATELY to window size
  // Don't wait for async callbacks - canvas defaults to 300x150 otherwise!
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
  console.log(`[CREATE] Canvas created with size: ${ctx.width}x${ctx.height}`);

  main.appendChild(ctx);

  return ctx;
};

// Also resize when window changes
window.addEventListener('resize', resizeAllCanvases);

export { addCanvas, createButtons, resizeAllCanvases };

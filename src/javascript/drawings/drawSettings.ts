export const getType = (setting) => {
  if (setting.max) {
    return "number";
  }

  if (setting.list) {
    return "select";
  }

  if (setting.checked) {
    return "checkbox";
  }

  return "color";
};

const createButtons = (parent, settings, i) => {
  // Create draggable layer container
  const containerButtons = document.createElement("div");
  containerButtons.className = "container-buttons";
  containerButtons.draggable = true;
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
};

const addCanvas = (main) => {
  const ctx = document.createElement("canvas");
  const i =
    Array.prototype.slice.apply(document.getElementsByTagName("canvas"))
      .length + 1 || 1;
  ctx.className = `canvas-${i}`;
  ctx.id = "canvas";
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
  main.appendChild(ctx);
  return ctx;
};

export { addCanvas, createButtons };

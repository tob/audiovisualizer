const getType = setting => {
  if (setting.icon) {
    return "button";
  }

  if (!setting.value) {
    return "checkbox";
  }

  if (setting.max) {
    return "number";
  }

  if (setting.list) {
    return "select";
  }

  return "color";
};

const createButtons = (parent, settings, i) => {
  const containerButtons = document.createElement("div");
  containerButtons.className = "container-buttons";
  const containerTitle = document.createElement("h4");
  containerTitle.innerText = `level - ${i}`;
  containerTitle.className = "container-buttons__title";
  parent.appendChild(containerButtons);
  containerButtons.appendChild(containerTitle);

  // Control visualization
  for (let setting in settings) {
    const { list, value, min, max, icon } = settings[setting];
    const type = getType(settings[setting]);

    const button = document.createElement("span");
    button.className = icon
      ? `controller__button controller__button-${icon}`
      : "controller__button";
    containerButtons.appendChild(button);

    const titleButton = document.createElement("p");
    titleButton.innerText = setting;
    button.appendChild(titleButton);

    const containerInput = document.createElement("label");
    containerInput.className =
      type === "checkbox" ? "controller__switch" : "controller__label";
    button.appendChild(containerInput);

    const input = list
      ? document.createElement("select")
      : document.createElement("input");

    input.type = type;
    input.className = `controller__slider-${setting}-${i}`;
    input.value = value;

    containerInput.appendChild(input);

    switch (type) {
      case "number":
        input.min = min;
        input.max = max;
        input.innerText = value;
        break;
      case "checkbox":
        const toggle = document.createElement("span");
        toggle.className = "controller__toggle";
        containerInput.appendChild(toggle);
        break;
      case "select":
        input.className = `controller__select-${setting}-${i}`;
        // create option value for each option and append inside selector
        settings[setting].list.map(option => {
          let element = document.createElement("option");
          element.value = option;
          element.innerText = option;
          input.appendChild(element);
        });

      case "button":
        const settingIcon = document.createElement("i");
        settingIcon.className = `fa ${icon}`;
        containerInput.appendChild(settingIcon);
        break;
    }
  }
};

const addCanvas = (main, controlboard, settings) => {
  const ctx = document.createElement("canvas");
  const i =
    Array.prototype.slice.apply(document.getElementsByTagName("canvas"))
      .length + 1 || 1;
  ctx.className = `canvas-${i}`;
  ctx.id = "canvas";
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
  main.appendChild(ctx);
  createButtons(controlboard, settings, i);
  return ctx;
};

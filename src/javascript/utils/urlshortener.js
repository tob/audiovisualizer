import { updateControllersValues } from "../utils/layer-settings.js";
export const shortenUrl = () => {
  let shortUrl = "";
  // select all the layers with settings
  const settings = Array.prototype.slice.apply(
    document.getElementsByClassName("container-buttons")
  );

  // create newUrl to replace previous
  let newURL = new URL(window.location.origin + window.location.pathname);
  let searchParams;

  //for each create a query param to append to the url
  settings.map((setting, index) => {
    let data = updateControllersValues(setting, index);

    let urlParameters = Object.entries(data)
      .map((e) => e.join("="))
      .join("&");

    searchParams = urlParameters;
    newURL.searchParams.set(`level-${index}`, searchParams.toString());
  });

  window.history.replaceState({ path: newURL.href }, "", newURL.href);

  // Example POST method implementation:
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST",
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  postData(`https://api.shrtco.de/v2/shorten?url=${newURL.href}`).then(
    (data) => {
      const { result } = data;
      const shortUrl = `${result.short_link}`;

      navigator.clipboard.writeText(shortUrl).then(
        function () {
          confirm(`Url shortened and copied in your clipboard
      	${shortUrl}
      	Send it via chat to share your visualization
      	`);
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    }
  );

  return shortUrl;
};

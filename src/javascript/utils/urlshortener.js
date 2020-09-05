const shortenUrl = () => {
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
      .map(e => e.join("="))
      .join("&");

    searchParams = urlParameters;
    newURL.searchParams.set(`level-${index}`, searchParams.toString());
  });

  window.history.replaceState({ path: newURL.href }, "", newURL.href);

  // Example POST method implementation:
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  postData("https://rel.ink/api/links/", { url: newURL.href }).then(data => {
    const { hashid } = data;
    const shortUrl = `https://rel.ink/${hashid}`;

    navigator.clipboard.writeText(shortUrl).then(
      function() {
        confirm(`Url shortened and copied in your clipboard
      	${shortUrl}
      	Send it via chat to share your visualization
      	`);
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  });

  return shortUrl;
};

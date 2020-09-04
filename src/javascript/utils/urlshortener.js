const shortenUrl = () => {
  const url = "";

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
	async function postData(url = '', data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'no-cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				// 'Content-Type': 'application/json'
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		return response.json(); // parses JSON response into native JavaScript objects
	}

	postData('https://rel.ink/api/links/', { url: newURL.href })
		.then(data => {
			console.log(data); // JSON data parsed by `data.json()` call
		});

  return url;
};

// // save settings to url
// let urlParameters = Object.entries(data)
// 	.map(e => e.join("="))
// 	.join("&");
// // console.log("URL params", urlParameters);
// state.data.search_params.set(`level-${index}`, urlParameters);
// // window.location.search = state.data.search_params.toString();
// if (window.history.pushState) {
// 	const newURL = new URL(window.location.origin);
// 	newURL.search = state.data.search_params.toString();
//
// 	//BROKEN Always true :(
// 	if (window.history.state.path.slice(49) !== newURL.search) {
// 		// console.log("state", window.history.state.path.slice(49) !== newURL.search);
// 		window.history.replaceState({ path: newURL.href }, "", newURL.href);
// 	}
// }

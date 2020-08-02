var endpoint =
  "https://www.jsonstore.io/3054cea1dbd5046794e8dde7958b2c13bb47de6081397fc6e34b3818af2a072b";

function geturl() {
  var url = window.location.href.toString(); // document.getElementById("urlinput").value;
  console.log("URL", url);
  var protocol_ok =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("ftp://");
  if (!protocol_ok) {
    newurl = "http://" + url;
    return newurl;
  } else {
    return url;
  }
}

function getrandom() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function genhash() {
  if (window.location.hash == "") {
    window.location.hash = getrandom();
  }
}

function send_request(url) {
  this.url = url;

  // let request = new XMLHttpRequest();
  // request.open("POST", `${endpoint}/${window.location.hash.substr(1)}`);
  // request.setRequestHeader("Content-type", "application/json");
  // request.send(JSON.stringify(this.url));

  console.log("Json?", JSON.stringify(this.url));
  fetch(`${endpoint}/${window.location.hash.substr(1)}`, {
    mode: "no-cors",
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: `{ name: "jon snow", age: 31 }`,
  });
}

var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.mode = 'no-cors';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

function shorturl() {
  var longurl = geturl();
  genhash();
  send_request(longurl);
}

var hashh = window.location.hash.substr(1);

if (window.location.hash != "") {
  getJSON(`${endpoint}/${hashh}`, function(err, data) {
    if (err !== null) {
      alert("Something went wrong: " + err);
    } else {
      alert("Your query count: " + data);
      data = data["result"];
      window.location.href = data;
    }
  });
}

import { getVideoElement } from "./dom-helpers";

export default function connectWebCam() {
  const video = getVideoElement("#webcam");

  if (!video) {
    throw new Error("Video element not found");
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        console.log("Microphone stream received:", stream);
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}

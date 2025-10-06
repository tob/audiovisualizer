import { startAudioVisual, stopAudioVisual } from "../step2/drawings/startDrawing";
import { audioSourceManager } from "../audio/AudioSourceManager";
import { MicrophoneSource } from "../audio/sources/MicrophoneSource";
import { MediaElementSource } from "../audio/sources/MediaElementSource";

export {};

// Register audio sources on module load
const microphoneSource = new MicrophoneSource();
const videoSource = new MediaElementSource('#video');

audioSourceManager.registerSource('microphone', microphoneSource);
audioSourceManager.registerSource('file', videoSource);

export default function handleMicrophone(button) {
  if (button.classList.contains("controller__button-start")) {
    window.listening = true;
    button.style.color = "red";
    button.classList.remove("controller__button-start");
    button.classList.add("controller__button-pause");
    button.innerHTML = "Listening  <i class='fa fa-volume-up'></i>";
    button.classList.toggle("blink", window.listening);

    // Check selected audio source
    const sourceSelector = document.querySelector('.controller__audio-source') as HTMLSelectElement;
    const selectedSource = sourceSelector?.value || 'microphone';

    // Start the selected source using the manager
    audioSourceManager.startSource(selectedSource)
      .then(() => {
        // For video sources, add a small delay to ensure layout is settled
        if (selectedSource === 'file') {
          console.log('Video source started, waiting for layout...');
          setTimeout(() => {
            startAudioVisual();
          }, 100);
        } else {
          startAudioVisual();
        }
      })
      .catch((error) => {
        console.error('Failed to start audio source:', error);
        alert(`Failed to start audio source: ${error.message}`);
        // Reset button state
        window.listening = false;
        button.style.color = "#ccc";
        button.classList.remove("controller__button-pause");
        button.classList.add("controller__button-start");
        button.innerHTML = "Start  <i class='fa fa-play'></i>";
        button.classList.toggle("blink", window.listening);
      });
  } else {
    window.listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", window.listening);

    // Stop visualization
    stopAudioVisual();

    // Stop current audio source
    audioSourceManager.stopCurrentSource();
  }
}

// Backward compatibility: keep the old getAudioInput export but use the manager
export function getAudioInput(source: MediaStream | HTMLMediaElement) {
  // This function is now deprecated but kept for backward compatibility
  // The new architecture uses audioSourceManager directly
  console.warn('getAudioInput is deprecated. Use audioSourceManager instead.');

  const { setupAudioAnalyzer } = require('../audio/analyzer');
  return setupAudioAnalyzer(source);
}

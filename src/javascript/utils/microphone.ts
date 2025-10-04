import { startAudioVisual, stopAudioVisual } from "../drawings/startDrawing";

export {};

declare global {
  interface Window {
    persistAudioStream?: MediaStream;
    audioContext?: AudioContext;
    currentAudioSource?: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;
    mediaElementSources?: Map<HTMLMediaElement, MediaElementAudioSourceNode>;
  }
}

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

    if (selectedSource === 'file') {
      // Use video file as source
      const videoElement = document.querySelector('#video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.play();
        startAudioVisual(videoElement);
      } else {
        console.error('Video element not found');
      }
    } else {
      // Use microphone as source
      startAudioVisual();
    }
  } else {
    window.listening = false;
    button.style.color = "#ccc";
    button.classList.remove("controller__button-pause");
    button.classList.add("controller__button-start");
    button.innerHTML = "Start  <i class='fa fa-play'></i>";
    button.classList.toggle("blink", window.listening);

    // Stop visualization
    stopAudioVisual();

    // Stop video if it's playing
    const videoElement = document.querySelector('#video') as HTMLVideoElement;
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
  }
}

export function getAudioInput(source: MediaStream | HTMLMediaElement) {
  // Reuse or create AudioContext (only one per page)
  if (!window.audioContext) {
    window.audioContext = new AudioContext();
  }
  const audioContext = window.audioContext;

  // Initialize media element sources map if it doesn't exist
  if (!window.mediaElementSources) {
    window.mediaElementSources = new Map();
  }

  let audioSource: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;

  // Determine source type and create appropriate audio source node
  if (source instanceof MediaStream) {
    // Disconnect previous source if exists
    if (window.currentAudioSource) {
      try {
        window.currentAudioSource.disconnect();
      } catch (e) {
        console.log('Could not disconnect previous source', e);
      }
    }

    window.persistAudioStream = source;
    audioSource = audioContext.createMediaStreamSource(source);
  } else {
    // HTMLMediaElement (video/audio element)
    // Check if we already have a source node for this element
    if (window.mediaElementSources.has(source)) {
      console.log('Reusing existing MediaElementSourceNode');
      audioSource = window.mediaElementSources.get(source)!;
    } else {
      // Create new source node (can only be done once per element)
      console.log('Creating new MediaElementSourceNode');
      audioSource = audioContext.createMediaElementSource(source);
      // Reconnect to speakers so we can hear it
      audioSource.connect(audioContext.destination);
      // Store for future reuse
      window.mediaElementSources.set(source, audioSource);
    }
  }

  // Store current source for tracking
  window.currentAudioSource = audioSource;

  const analyser = audioContext.createAnalyser();

  // Better FFT size for frequency resolution (512 bins)
  analyser.fftSize = 1024;

  // Wider dynamic range for video files (which often have compressed audio)
  // Lower minDecibels picks up quieter high frequencies
  analyser.minDecibels = -90;
  analyser.maxDecibels = -20;

  // Less smoothing for more responsive visuals (especially for video)
  analyser.smoothingTimeConstant = 0.75;

  audioSource.connect(analyser);

  const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

  // Get sample rate to calculate actual frequencies
  const sampleRate = audioContext.sampleRate;
  const nyquist = sampleRate / 2;

  console.log(`Audio Analysis Setup:
    - Source Type: ${source instanceof MediaStream ? 'Microphone' : 'Media Element'}
    - Sample Rate: ${sampleRate}Hz
    - FFT Size: ${analyser.fftSize}
    - Frequency Bins: ${analyser.frequencyBinCount}
    - Frequency per Bin: ${nyquist / analyser.frequencyBinCount}Hz
    - Max Frequency: ${nyquist}Hz
  `);

  return {
    analyser,
    frequencyArray,
    sampleRate,
    nyquist
  };
}

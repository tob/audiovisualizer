/**
 * Audio analyzer module - handles AudioContext and AnalyserNode setup
 */

export interface AudioAnalyzerConfig {
  fftSize?: number;
  minDecibels?: number;
  maxDecibels?: number;
  smoothingTimeConstant?: number;
}

export interface AudioAnalyzerResult {
  analyser: AnalyserNode;
  frequencyArray: Uint8Array<ArrayBuffer>;
  sampleRate: number;
  nyquist: number;
}

declare global {
  interface Window {
    audioContext?: AudioContext;
    currentAudioSource?: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;
    mediaElementSources?: Map<HTMLMediaElement, MediaElementAudioSourceNode>;
  }
}

/**
 * Get or create the shared AudioContext
 */
export function getAudioContext(): AudioContext {
  if (!window.audioContext) {
    window.audioContext = new AudioContext();
  }
  return window.audioContext;
}

/**
 * Create an audio source node from a MediaStream or HTMLMediaElement
 */
export function createAudioSourceNode(
  source: MediaStream | HTMLMediaElement,
  audioContext: AudioContext
): MediaStreamAudioSourceNode | MediaElementAudioSourceNode {
  let audioSource: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;

  if (source instanceof MediaStream) {
    // Disconnect previous source if exists
    if (window.currentAudioSource) {
      try {
        window.currentAudioSource.disconnect();
      } catch (e) {
        console.log('Could not disconnect previous source', e);
      }
    }

    audioSource = audioContext.createMediaStreamSource(source);
  } else {
    // HTMLMediaElement (video/audio element)
    // Initialize map if needed
    if (!window.mediaElementSources) {
      window.mediaElementSources = new Map();
    }

    // Check if we already have a source node for this element
    if (window.mediaElementSources.has(source)) {
      console.log('Reusing existing MediaElementSourceNode');
      audioSource = window.mediaElementSources.get(source)!;
    } else {
      // Create new source node (can only be done once per element)
      console.log('Creating new MediaElementSourceNode');
      audioSource = audioContext.createMediaElementSource(source);
      // Connect to speakers so we can hear it
      audioSource.connect(audioContext.destination);
      // Store for future reuse
      window.mediaElementSources.set(source, audioSource);
    }
  }

  // Store current source for tracking
  window.currentAudioSource = audioSource;

  return audioSource;
}

/**
 * Setup audio analyzer with the given source
 */
export function setupAudioAnalyzer(
  source: MediaStream | HTMLMediaElement,
  config: AudioAnalyzerConfig = {}
): AudioAnalyzerResult {
  const {
    fftSize = 1024,
    minDecibels = -90,
    maxDecibels = -20,
    smoothingTimeConstant = 0.75
  } = config;

  const audioContext = getAudioContext();
  const audioSource = createAudioSourceNode(source, audioContext);
  const analyser = audioContext.createAnalyser();

  // Configure analyser
  analyser.fftSize = fftSize;
  analyser.minDecibels = minDecibels;
  analyser.maxDecibels = maxDecibels;
  analyser.smoothingTimeConstant = smoothingTimeConstant;

  // Connect source to analyser
  audioSource.connect(analyser);

  const frequencyArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
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

/**
 * Disconnect the current audio source
 */
export function disconnectCurrentSource(): void {
  if (window.currentAudioSource) {
    try {
      window.currentAudioSource.disconnect();
      console.log('Disconnected audio source');
    } catch (e) {
      console.log('Could not disconnect audio source', e);
    }
  }
}

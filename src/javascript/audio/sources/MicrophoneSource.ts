import { AudioSource } from '../AudioSource';

declare global {
  interface Window {
    persistAudioStream?: MediaStream;
  }
}

/**
 * Audio source that captures from the user's microphone
 */
export class MicrophoneSource implements AudioSource {
  private stream?: MediaStream;

  async initialize(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      // Store in global for persistence
      window.persistAudioStream = this.stream;

      console.log('Microphone initialized successfully');
      return this.stream;
    } catch (error) {
      console.error('Failed to initialize microphone:', error);
      throw new Error('Microphone access denied or unavailable');
    }
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
      window.persistAudioStream = undefined;
      console.log('Microphone cleaned up');
    }
  }

  getDisplayName(): string {
    return 'Microphone';
  }

  isAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

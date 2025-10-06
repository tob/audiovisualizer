import { AudioSource } from '../AudioSource';

/**
 * Audio source that uses an HTML video or audio element
 */
export class MediaElementSource implements AudioSource {
  private element?: HTMLMediaElement;
  private elementSelector: string;

  /**
   * @param elementSelector - CSS selector for the media element (e.g., '#video')
   */
  constructor(elementSelector: string) {
    this.elementSelector = elementSelector;
  }

  async initialize(): Promise<HTMLMediaElement> {
    const element = document.querySelector(this.elementSelector) as HTMLMediaElement;

    if (!element) {
      throw new Error(`Media element not found: ${this.elementSelector}`);
    }

    if (!(element instanceof HTMLVideoElement) && !(element instanceof HTMLAudioElement)) {
      throw new Error(`Element ${this.elementSelector} is not a video or audio element`);
    }

    this.element = element;

    // Start playing the media
    try {
      await element.play();
      console.log(`Media element ${this.elementSelector} initialized and playing`);
    } catch (error) {
      console.error('Failed to play media element:', error);
      throw new Error('Failed to play media element');
    }

    return element;
  }

  cleanup(): void {
    if (this.element && !this.element.paused) {
      this.element.pause();
      console.log(`Media element ${this.elementSelector} paused`);
    }
    this.element = undefined;
  }

  getDisplayName(): string {
    return `Media: ${this.elementSelector}`;
  }

  isAvailable(): boolean {
    const element = document.querySelector(this.elementSelector);
    return element instanceof HTMLVideoElement || element instanceof HTMLAudioElement;
  }
}

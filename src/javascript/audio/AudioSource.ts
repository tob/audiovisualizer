/**
 * Interface for audio sources that can be analyzed and visualized
 */
export interface AudioSource {
  /**
   * Initialize the audio source and return the media stream or element
   */
  initialize(): Promise<MediaStream | HTMLMediaElement>;

  /**
   * Clean up resources when source is no longer needed
   */
  cleanup(): void;

  /**
   * Get a display name for this source
   */
  getDisplayName(): string;

  /**
   * Check if this source is available/supported
   */
  isAvailable(): boolean;
}

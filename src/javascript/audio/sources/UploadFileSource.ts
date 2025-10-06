import { AudioSource } from '../AudioSource';

/**
 * Audio source that uses an uploaded audio/video file
 */
export class UploadFileSource implements AudioSource {
  private mediaElement?: HTMLMediaElement;
  private file?: File;
  private objectUrl?: string;

  /**
   * @param file - The uploaded audio/video file
   */
  constructor(file?: File) {
    this.file = file;
  }

  /**
   * Set the file to be used (useful when creating instance before file selection)
   */
  setFile(file: File): void {
    this.file = file;
  }

  async initialize(): Promise<HTMLMediaElement> {
    if (!this.file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['audio/', 'video/'];
    const isValid = validTypes.some(type => this.file!.type.startsWith(type));

    if (!isValid) {
      throw new Error(`Invalid file type: ${this.file.type}. Please upload an audio or video file.`);
    }

    // Create object URL from file
    this.objectUrl = URL.createObjectURL(this.file);

    // Determine if it's audio or video
    const isAudio = this.file.type.startsWith('audio/');

    // Create appropriate media element
    if (isAudio) {
      this.mediaElement = document.createElement('audio');
    } else {
      this.mediaElement = document.createElement('video');
    }

    // Set source and configure
    this.mediaElement.src = this.objectUrl;
    this.mediaElement.controls = true; // Show controls so user can see playback
    this.mediaElement.id = 'uploaded-media';
    this.mediaElement.className = 'uploaded-media';

    // Append to dedicated container
    const container = document.getElementById('uploaded-media-player');
    if (container) {
      container.appendChild(this.mediaElement);
    } else {
      // Fallback to body if container not found
      document.body.appendChild(this.mediaElement);
    }

    // Load the media
    this.mediaElement.load();

    // Wait for media to be ready
    await new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        this.mediaElement!.removeEventListener('canplay', onCanPlay);
        this.mediaElement!.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        this.mediaElement!.removeEventListener('canplay', onCanPlay);
        this.mediaElement!.removeEventListener('error', onError);
        reject(new Error('Failed to load uploaded file'));
      };

      this.mediaElement!.addEventListener('canplay', onCanPlay);
      this.mediaElement!.addEventListener('error', onError);
    });

    // Start playing
    try {
      await this.mediaElement.play();
      console.log(`Uploaded file initialized and playing: ${this.file.name}`);
    } catch (error) {
      console.error('Failed to play uploaded file:', error);
      throw new Error('Failed to play uploaded file');
    }

    return this.mediaElement;
  }

  cleanup(): void {
    if (this.mediaElement) {
      if (!this.mediaElement.paused) {
        this.mediaElement.pause();
      }

      // Remove from DOM
      if (this.mediaElement.parentNode) {
        this.mediaElement.parentNode.removeChild(this.mediaElement);
      }

      this.mediaElement = undefined;
      console.log('Uploaded file cleaned up');
    }

    // Revoke object URL to free memory
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }

  getDisplayName(): string {
    return this.file ? `Upload: ${this.file.name}` : 'Upload File';
  }

  isAvailable(): boolean {
    // File upload is always available in modern browsers
    return !!(window.File && window.FileReader && window.Blob);
  }

  /**
   * Get the uploaded file name
   */
  getFileName(): string | undefined {
    return this.file?.name;
  }

  /**
   * Get the file size in bytes
   */
  getFileSize(): number | undefined {
    return this.file?.size;
  }
}

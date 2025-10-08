import { audioSourceManager } from '../audio/AudioSourceManager';
import { MicrophoneSource } from '../audio/sources/MicrophoneSource';
import { UploadFileSource } from '../audio/sources/UploadFileSource';

export type SourceType = 'microphone' | 'upload';

/**
 * Step 1: Source Selection UI
 * Displays a modal for the user to choose their audio source
 */
export class SourceSelector {
  private container: HTMLElement;
  private selectedSource?: SourceType;
  private selectedFile?: File;
  private onSourceSelected?: (source: SourceType) => void;

  constructor(containerId: string = 'source-selector') {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element #${containerId} not found`);
    }
    this.container = container;
  }

  /**
   * Show the source selection modal
   */
  show(onComplete: (source: SourceType) => void): void {
    this.onSourceSelected = onComplete;
    this.render();
    this.container.style.display = 'flex';
  }

  /**
   * Hide the source selection modal
   */
  hide(): void {
    this.container.style.display = 'none';
  }

  /**
   * Render the source selection UI
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="source-selector__overlay">
        <div class="source-selector__modal">
          <h1 class="source-selector__title">Choose Audio Source</h1>
          <p class="source-selector__subtitle">Select where your audio will come from</p>

          <div class="source-selector__options">
            <button class="source-selector__option" data-source="microphone">
              <i class="fa fa-microphone source-selector__icon"></i>
              <span class="source-selector__label">Microphone</span>
              <span class="source-selector__description">Capture live audio from your microphone</span>
            </button>

            <button class="source-selector__option source-selector__option--upload" data-source="upload" type="button">
              <i class="fa fa-upload source-selector__icon"></i>
              <span class="source-selector__label">Upload File</span>
              <span class="source-selector__description">Upload your own audio or video file</span>
              <span class="source-selector__file-name"></span>
            </button>
            <input type="file" class="source-selector__file-input" accept="audio/*,video/*" style="display: none;">
          </div>

          <button class="source-selector__continue" disabled>
            Continue <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Attach event listeners to UI elements
   */
  private attachEventListeners(): void {
    const options = this.container.querySelectorAll('.source-selector__option');
    const continueBtn = this.container.querySelector('.source-selector__continue') as HTMLButtonElement;
    const fileInput = this.container.querySelector('.source-selector__file-input') as HTMLInputElement;
    const fileNameDisplay = this.container.querySelector('.source-selector__file-name') as HTMLSpanElement;

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        const source = option.getAttribute('data-source') as SourceType;

        // For upload option, trigger file input instead
        if (source === 'upload') {
          fileInput.click();
          e.preventDefault();
          return;
        }

        // Remove selection from all options
        options.forEach(opt => opt.classList.remove('selected'));

        // Mark this option as selected
        option.classList.add('selected');

        // Store the selected source
        this.selectedSource = source;

        // Enable continue button
        continueBtn.disabled = false;
      });
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // Store the file
        this.selectedFile = file;
        this.selectedSource = 'upload';

        // Update UI
        options.forEach(opt => opt.classList.remove('selected'));
        const uploadOption = this.container.querySelector('[data-source="upload"]');
        uploadOption?.classList.add('selected');

        // Show file name
        fileNameDisplay.textContent = `Selected: ${file.name}`;
        fileNameDisplay.style.display = 'block';

        // Enable continue button
        continueBtn.disabled = false;
      }
    });

    continueBtn.addEventListener('click', async () => {
      if (!this.selectedSource) return;

      // Validate upload source has a file
      if (this.selectedSource === 'upload' && !this.selectedFile) {
        alert('Please select a file to upload');
        return;
      }

      try {
        continueBtn.disabled = true;
        continueBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Initializing...';

        // Initialize the selected audio source
        await this.initializeSource(this.selectedSource);

        // Hide the modal and call callback
        this.hide();
        if (this.onSourceSelected) {
          this.onSourceSelected(this.selectedSource);
        }
      } catch (error) {
        console.error('Failed to initialize audio source:', error);
        alert(`Failed to initialize audio source: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // Reset button state
        continueBtn.disabled = false;
        continueBtn.innerHTML = 'Continue <i class="fa fa-arrow-right"></i>';
      }
    });
  }

  /**
   * Initialize the selected audio source
   */
  private async initializeSource(source: SourceType): Promise<void> {
    // Register sources if not already registered
    if (!audioSourceManager.getSource('microphone')) {
      const microphoneSource = new MicrophoneSource();
      audioSourceManager.registerSource('microphone', microphoneSource);
    }

    if (source === 'upload' && !audioSourceManager.getSource('upload')) {
      // For upload, we create the source with the selected file
      if (!this.selectedFile) {
        throw new Error('No file selected for upload');
      }
      const uploadSource = new UploadFileSource(this.selectedFile);
      audioSourceManager.registerSource('upload', uploadSource);
    }

    // Start the selected source
    await audioSourceManager.startSource(source);

    console.log(`Audio source "${source}" initialized successfully`);
  }

  /**
   * Get the currently selected source
   */
  getSelectedSource(): SourceType | undefined {
    return this.selectedSource;
  }
}

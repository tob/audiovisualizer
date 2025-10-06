import { AudioSource } from './AudioSource';
import { setupAudioAnalyzer, disconnectCurrentSource, AudioAnalyzerResult, AudioAnalyzerConfig } from './analyzer';

/**
 * Manages audio sources and provides a unified interface for switching between them
 */
export class AudioSourceManager {
  private sources: Map<string, AudioSource> = new Map();
  private currentSourceKey?: string;
  private currentSource?: AudioSource;
  private analyzerResult?: AudioAnalyzerResult;

  /**
   * Register an audio source with a unique key
   */
  registerSource(key: string, source: AudioSource): void {
    if (this.sources.has(key)) {
      console.warn(`Source with key "${key}" already registered, overwriting`);
    }
    this.sources.set(key, source);
    console.log(`Registered audio source: ${key} (${source.getDisplayName()})`);
  }

  /**
   * Get all registered source keys
   */
  getRegisteredSourceKeys(): string[] {
    return Array.from(this.sources.keys());
  }

  /**
   * Get a source by key
   */
  getSource(key: string): AudioSource | undefined {
    return this.sources.get(key);
  }

  /**
   * Check if a source is currently active
   */
  isSourceActive(): boolean {
    return !!this.currentSource;
  }

  /**
   * Get the current active source key
   */
  getCurrentSourceKey(): string | undefined {
    return this.currentSourceKey;
  }

  /**
   * Get the current analyzer result
   */
  getAnalyzerResult(): AudioAnalyzerResult | undefined {
    return this.analyzerResult;
  }

  /**
   * Start an audio source and setup analyzer
   */
  async startSource(key: string, config?: AudioAnalyzerConfig): Promise<AudioAnalyzerResult> {
    const source = this.sources.get(key);
    if (!source) {
      throw new Error(`Audio source "${key}" not found`);
    }

    if (!source.isAvailable()) {
      throw new Error(`Audio source "${key}" is not available`);
    }

    // Cleanup previous source if exists
    if (this.currentSource) {
      console.log(`Stopping current source: ${this.currentSourceKey}`);
      this.stopCurrentSource();
    }

    console.log(`Starting audio source: ${key} (${source.getDisplayName()})`);

    // Initialize the source
    const mediaSource = await source.initialize();

    // Setup analyzer
    this.analyzerResult = setupAudioAnalyzer(mediaSource, config);

    // Store current source
    this.currentSource = source;
    this.currentSourceKey = key;

    return this.analyzerResult;
  }

  /**
   * Stop the current audio source
   */
  stopCurrentSource(): void {
    if (this.currentSource) {
      console.log(`Stopping source: ${this.currentSourceKey}`);
      this.currentSource.cleanup();
      this.currentSource = undefined;
      this.currentSourceKey = undefined;
    }

    // Disconnect audio graph
    disconnectCurrentSource();

    this.analyzerResult = undefined;
  }

  /**
   * Switch to a different audio source
   */
  async switchSource(key: string, config?: AudioAnalyzerConfig): Promise<AudioAnalyzerResult> {
    return this.startSource(key, config);
  }
}

// Export a singleton instance
export const audioSourceManager = new AudioSourceManager();

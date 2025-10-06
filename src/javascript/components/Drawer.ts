/**
 * Drawer component for sliding settings panel
 */
export class Drawer {
  private drawer: HTMLElement;
  private overlay: HTMLElement;
  private isOpen: boolean = false;

  constructor() {
    this.drawer = document.getElementById('settings-drawer') as HTMLElement;
    this.overlay = document.getElementById('drawer-overlay') as HTMLElement;

    if (!this.drawer || !this.overlay) {
      console.error('Drawer elements not found');
      return;
    }

    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Close button
    const closeButton = this.drawer.querySelector('.drawer__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Overlay click to close
    this.overlay.addEventListener('click', () => this.close());

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Open the drawer
   */
  open(): void {
    this.drawer.classList.add('open');
    this.overlay.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  /**
   * Close the drawer
   */
  close(): void {
    this.drawer.classList.remove('open');
    this.overlay.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = ''; // Restore scroll
  }

  /**
   * Toggle drawer state
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Check if drawer is open
   */
  getIsOpen(): boolean {
    return this.isOpen;
  }
}

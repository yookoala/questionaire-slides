import { LitElement, html, css } from 'lit';

/**
 * QuestionaireContainer - A carousel component for displaying questionaire slides
 * Uses horizontal scrolling to smoothly transition between slides
 */
export class QuestionaireContainer extends LitElement {
  static properties = {
    currentIndex: { type: Number },
    ready: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: auto;
    }

    .container {
      display: flex;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease-in-out;
    }

    ::slotted(*) {
      flex: 0 0 100%;
      width: 100%;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
    this.currentIndex = 0;
    this.ready = '';
  }

  firstUpdated() {
    this._updateContainer();
    // Set ready attribute to "1" after rendering
    this.ready = '1';
  }

  render() {
    return html`
      <div class="container">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  _handleSlotChange() {
    this._updateContainer();
  }

  _updateContainer() {
    const container = this.shadowRoot.querySelector('.container');
    if (!container) return;

    // Calculate the transform position based on current index
    const translateX = -this.currentIndex * 100;
    container.style.transform = `translateX(${translateX}%)`;
  }

  /**
   * Navigate to the next slide
   */
  next() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const children = slot.assignedElements();
    if (this.currentIndex < children.length - 1) {
      this.currentIndex++;
      this._updateContainer();
      this._dispatchSlideChangeEvent();
    }
  }

  /**
   * Navigate to the previous slide
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._updateContainer();
      this._dispatchSlideChangeEvent();
    }
  }

  /**
   * Navigate to a specific slide by index
   * @param {number} index - The index of the slide to navigate to
   */
  goToSlide(index) {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const children = slot.assignedElements();
    if (index >= 0 && index < children.length) {
      this.currentIndex = index;
      this._updateContainer();
      this._dispatchSlideChangeEvent();
    }
  }

  /**
   * Dispatch a custom event when the slide changes
   */
  _dispatchSlideChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('slide-changed', {
        detail: { index: this.currentIndex },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Get the total number of slides
   */
  get slideCount() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return 0;
    return slot.assignedElements().length;
  }
}

customElements.define('questionaire-container', QuestionaireContainer);

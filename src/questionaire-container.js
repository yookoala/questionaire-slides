import { LitElement, html, css } from 'lit';

/**
 * QuestionaireContainer - A carousel component for displaying questionaire slides
 * Shows one child element at a time and provides navigation methods
 */
export class QuestionaireContainer extends LitElement {
  static properties = {
    currentIndex: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
    }

    ::slotted(*) {
      display: none;
    }

    ::slotted([data-active]) {
      display: block;
    }
  `;

  constructor() {
    super();
    this.currentIndex = 0;
  }

  firstUpdated() {
    this._updateSlides();
  }

  render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }

  _handleSlotChange() {
    this._updateSlides();
  }

  _updateSlides() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const children = slot.assignedElements();
    
    children.forEach((child, index) => {
      if (index === this.currentIndex) {
        child.setAttribute('data-active', '');
        child.style.display = 'block';
      } else {
        child.removeAttribute('data-active');
        child.style.display = 'none';
      }
    });
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
      this._updateSlides();
      this._dispatchSlideChangeEvent();
    }
  }

  /**
   * Navigate to the previous slide
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._updateSlides();
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
      this._updateSlides();
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

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
   * Validates the current item (if applicable) before navigation
   * If current item has a validate() method and validation fails, throws error and refuses to navigate
   */
  next() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const children = slot.assignedElements();
    if (this.currentIndex < children.length - 1) {
      // Get current element and validate if applicable
      const currentElement = children[this.currentIndex];
      
      // If current element has a validate method, call it
      if (currentElement && typeof currentElement.validate === 'function') {
        try {
          currentElement.validate();
        } catch (validationError) {
          // Validation failed - throw the error and refuse to navigate
          throw validationError;
        }
      }
      
      // Validation passed or no validation needed - proceed with navigation
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

  /**
   * Get aggregated content from all questionaire-question-content elements
   * Returns a string with all content text separated by newlines
   */
  getContents() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return '';

    const contentTexts = [];
    const questions = slot.assignedElements();
    
    questions.forEach(question => {
      if (question.tagName === 'QUESTIONAIRE-QUESTION') {
        const contentElements = question.querySelectorAll('questionaire-question-content');
        contentElements.forEach(content => {
          // Get the text content and trim whitespace
          const text = content.textContent?.trim();
          if (text) {
            contentTexts.push(text);
          }
        });
      }
    });

    return contentTexts.join('\n');
  }

  /**
   * Get aggregated values from all named questionaire-question elements
   * Returns an object with question names as keys and question values as values
   * Only includes questions with non-empty name attributes
   */
  get values() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return {};

    const valuesObject = {};
    const questions = slot.assignedElements();
    
    questions.forEach(question => {
      if (question.tagName === 'QUESTIONAIRE-QUESTION') {
        const name = question.getAttribute('name');
        // Only include questions with non-empty name attributes
        if (name && name.trim() !== '') {
          valuesObject[name] = question.value;
        }
      }
    });

    return valuesObject;
  }

  /**
   * Get the currently focused child element
   * Returns the child element at the current index, or null if no elements
   */
  current() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return null;

    const children = slot.assignedElements();
    if (children.length === 0) return null;

    // Return the element at the current index
    if (this.currentIndex >= 0 && this.currentIndex < children.length) {
      return children[this.currentIndex];
    }

    return null;
  }
}

customElements.define('questionaire-container', QuestionaireContainer);

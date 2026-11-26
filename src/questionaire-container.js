import { LitElement, html, css } from 'lit';

/**
 * QuestionaireContainer - A carousel component for displaying questionaire slides
 * Uses horizontal scrolling to smoothly transition between slides
 */
export class QuestionaireContainer extends LitElement {
  static properties = {
    currentIndex: { type: Number },
    ready: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: auto;
      box-sizing: border-box;
    }

    .container {
      display: grid;
      /* Let slides keep their natural content height (instead of stretching
         to the row height), so the current slide's height is measurable. */
      align-items: start;
      height: 100%;
      transition: transform 0.3s ease-in-out, height 0.3s ease-in-out;
      /* Grid template columns will be set dynamically via inline styles */
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(128, 128, 128, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
      z-index: 1000;
    }

    :host([disabled]) .overlay {
      opacity: 1;
      pointer-events: all;
    }

    ::slotted(*) {
      width: 100%;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
    this.currentIndex = 0;
    this.ready = '';
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Re-observe on (re)connect: firstUpdated only runs once, but a
    // disconnected element loses its resize observations.
    this._observeSlides();
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    super.disconnectedCallback();
  }

  /**
   * Watch slides for content size changes (e.g. async content, images
   * loading, validation messages appearing) and keep the container height
   * in sync with the current slide.
   */
  _ensureResizeObserver() {
    if (typeof ResizeObserver === 'undefined' || this._resizeObserver) {
      return;
    }
    this._resizeObserver = new ResizeObserver(() => this._updateContainer());
  }

  /**
   * Observe the slotted slides with the resize observer.
   */
  _observeSlides() {
    this._ensureResizeObserver();
    if (!this._resizeObserver) return;

    this._resizeObserver.disconnect();
    const slot = this.shadowRoot?.querySelector('slot');
    const children = slot ? slot.assignedElements() : [];
    for (const child of children) {
      this._resizeObserver.observe(child);
    }
  }

  firstUpdated() {
    this._observeSlides();
    this._updateContainer();
    // Set ready attribute to "1" after rendering
    this.ready = '1';
  }

  render() {
    return html`
      <div class="container">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      <div class="overlay" part="disable-overlay"></div>
    `;
  }

  _handleSlotChange() {
    this._observeSlides();
    this._updateContainer();
  }

  _updateContainer() {
    if (!this.shadowRoot) return;

    const container = this.shadowRoot.querySelector('.container');
    if (!container) return;

    const slot = this.shadowRoot.querySelector('slot');
    const children = slot ? slot.assignedElements() : [];
    const childCount = children.length;

    if (childCount > 0) {
      // Set grid template columns dynamically based on number of children
      const gridColumns = Array(childCount).fill('1fr').join(' ');
      container.style.gridTemplateColumns = gridColumns;

      // Set container width to accommodate all children
      container.style.width = `${childCount * 100}%`;

      // Calculate the transform position based on current index
      const translateX = -this.currentIndex * (100 / childCount);
      container.style.transform = `translateX(${translateX}%)`;

      this._updateHeight(container, children);
    } else {
      // Handle empty container
      container.style.gridTemplateColumns = '1fr';
      container.style.width = '100%';
      container.style.transform = 'translateX(0%)';
      container.style.height = '';
      this._heightApplied = false;
    }
  }

  /**
   * Fit the container to the height of the current slide.
   *
   * Slides are laid out as grid columns side by side, and hidden slides
   * still occupy the single grid row. Without an explicit height, the
   * container would be as tall as the tallest slide, leaving a large blank
   * band below the (usually shorter) current slide on every step.
   * `align-items: start` keeps each slide at its natural content height,
   * so it can be measured and applied to the container here.
   *
   * The first height application skips the height transition: the raw
   * container is as tall as the tallest slide, and animating from that
   * would cause a visible shrink on load.
   *
   * @param {HTMLElement} container The .container element in the shadow DOM
   * @param {Element[]} children The assigned slide elements
   */
  _updateHeight(container, children) {
    const current = children[this.currentIndex];
    if (!current) return;

    const height = `${current.getBoundingClientRect().height}px`;

    if (!this._heightApplied) {
      const previousTransition = container.style.transition;
      container.style.transition = 'none';
      container.style.height = height;
      // Force a style flush so the height applies without a transition.
      void container.offsetHeight;
      container.style.transition = previousTransition;
      this._heightApplied = true;
    } else {
      container.style.height = height;
    }
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

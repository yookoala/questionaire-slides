import { LitElement, html, css } from 'lit';

/**
 * Questionaire Action Element
 * Button-like element to simplify implementation of navigations in questionaire-container
 */
export class QuestionaireAction extends LitElement {
  static properties = {
    action: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      cursor: pointer;
      user-select: none;
      /* Moved from .action-button */
      width: 100%;
      padding: 10px 20px;
      border: 2px solid #007bff;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      transition: all 0.2s ease;
      min-width: 80px;
      box-sizing: border-box;
    }

    :host(:hover) {
      background-color: #0056b3;
      border-color: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    :host(:active) {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    :host([action="previous"]) {
      background-color: #6c757d;
      border-color: #6c757d;
    }

    :host([action="previous"]:hover) {
      background-color: #5a6268;
      border-color: #5a6268;
    }

    :host([action="button"]) {
      background-color: #28a745;
      border-color: #28a745;
    }

    :host([action="button"]:hover) {
      background-color: #218838;
      border-color: #1e7e34;
    }

    :host([disabled]) {
      background-color: #e9ecef;
      border-color: #dee2e6;
      color: #6c757d;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    :host([disabled]:hover) {
      background-color: #e9ecef;
      border-color: #dee2e6;
      transform: none;
      box-shadow: none;
    }

    /* Invalid state styling (internal validation failure) */
    :host(.invalid) {
      background-color: #e9ecef;
      border-color: #dee2e6;
      color: #6c757d;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      opacity: 0.6;
    }

    :host(.invalid:hover) {
      background-color: #e9ecef;
      border-color: #dee2e6;
      transform: none;
      box-shadow: none;
    }
  `;

  constructor() {
    super();
    this.action = 'next'; // Default action
    this.disabled = false;
    this._invalid = false; // Internal validation state
    this._containerEventListener = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    
    // Initialize validation state after component is connected
    this.updateComplete.then(() => {
      this._setupValidationListening();
      this._checkValidationState();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this._cleanupValidationListening();
  }

  /**
   * Set up event listener for container changes
   */
  _setupValidationListening() {
    const container = this.closest('questionaire-container');
    if (container) {
      this._containerEventListener = () => {
        this._checkValidationState();
      };
      container.addEventListener('container:changed', this._containerEventListener);
    }
  }

  /**
   * Clean up event listeners
   */
  _cleanupValidationListening() {
    const container = this.closest('questionaire-container');
    if (container && this._containerEventListener) {
      container.removeEventListener('container:changed', this._containerEventListener);
      this._containerEventListener = null;
    }
  }

  /**
   * Walk up the light DOM from this element to find the direct child of the
   * given container that contains this action. This is the slide the action
   * "belongs to", which may differ from container.current() when multiple
   * slides are present.
   *
   * @param {HTMLElement} container
   * @returns {HTMLElement|null}
   */
  _getOwnerSlide(container) {
    let el = this;
    while (el && el.parentElement !== container) {
      el = el.parentElement;
    }
    return el || null;
  }

  /**
   * Check the current validation state and update invalid state.
   * Only applies to "next" actions.
   * Validates against the slide this action belongs to, not the globally
   * visible slide — so buttons on other slides are never affected.
   */
  _checkValidationState() {
    // Only validate "next" actions (default action)
    const actionType = this.action || 'next';
    if (actionType !== 'next') {
      this._setInvalidState(false);
      return;
    }

    const container = this.closest('questionaire-container');
    if (!container) {
      this._setInvalidState(false);
      return;
    }

    // Validate against the slide this action belongs to, not container.current().
    const ownerSlide = this._getOwnerSlide(container);
    if (!ownerSlide || typeof ownerSlide.validate !== 'function') {
      this._setInvalidState(false);
      return;
    }

    // Try to validate the owner slide
    try {
      ownerSlide.validate();
      this._setInvalidState(false); // Validation passed
    } catch (validationError) {
      this._setInvalidState(true); // Validation failed
    }
  }

  /**
   * Set the internal invalid state
   */
  _setInvalidState(invalid) {
    const wasInvalid = this._invalid;
    this._invalid = invalid;
    
    if (wasInvalid !== invalid) {
      if (invalid) {
        this.classList.add('invalid');
      } else {
        this.classList.remove('invalid');
      }
    }
  }

  /**
   * Check if the action should be prevented (disabled or invalid)
   */
  _shouldPreventAction() {
    return this.disabled || this._invalid;
  }

  /**
   * Handle click events on the action button
   */
  _handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Prevent action if disabled or invalid
    if (this._shouldPreventAction()) {
      return;
    }

    // Determine the action to perform
    const actionType = this.action || 'next';
    
    // Handle button action - just dispatch custom event, no navigation
    if (actionType === 'button') {
      // Dispatch a custom 'action-click' event for button behavior
      this.dispatchEvent(new CustomEvent('action-click', {
        detail: { action: 'button', element: this },
        bubbles: true,
        composed: true
      }));
      return;
    }

    // Find the closest parent questionaire-container for navigation actions
    const container = this.closest('questionaire-container');
    
    if (!container) {
      // No container found - silently do nothing (for standalone actions)
      console.warn('questionaire-action: No parent questionaire-container found');
      return;
    }
    
    try {
      // Apply the action to the container
      switch (actionType) {
        case 'next':
          container.next();
          break;
        case 'previous':
          container.previous();
          break;
        default:
          // Invalid action - treat as 'next'
          console.warn(`questionaire-action: Invalid action "${actionType}", defaulting to "next"`);
          container.next();
          break;
      }
    } catch (error) {
      // Let validation errors bubble up - they should be handled by the application
      throw error;
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

// Register the custom element
customElements.define('questionaire-action', QuestionaireAction);
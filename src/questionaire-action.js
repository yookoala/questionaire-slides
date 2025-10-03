import { LitElement, html, css } from 'lit';

/**
 * Questionaire Action Element
 * Button-like element to simplify implementation of navigations in questionaire-container
 */
export class QuestionaireAction extends LitElement {
  static properties = {
    action: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      cursor: pointer;
      user-select: none;
    }

    .action-button {
      display: block;
      width: 100%;
      padding: 10px 20px;
      border: 2px solid #007bff;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 80px;
      box-sizing: border-box;
    }

    .action-button:hover {
      background-color: #0056b3;
      border-color: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .action-button:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    :host([action="previous"]) .action-button {
      background-color: #6c757d;
      border-color: #6c757d;
    }

    :host([action="previous"]) .action-button:hover {
      background-color: #5a6268;
      border-color: #5a6268;
    }

    :host([disabled]) .action-button {
      background-color: #e9ecef;
      border-color: #dee2e6;
      color: #6c757d;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    :host([disabled]) .action-button:hover {
      background-color: #e9ecef;
      border-color: #dee2e6;
      transform: none;
      box-shadow: none;
    }
  `;

  constructor() {
    super();
    this.action = 'next'; // Default action
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
  }

  /**
   * Handle click events on the action button
   */
  _handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Find the closest parent questionaire-container
    const container = this.closest('questionaire-container');
    
    if (!container) {
      // No container found - silently do nothing (for standalone actions)
      console.warn('questionaire-action: No parent questionaire-container found');
      return;
    }

    // Determine the action to perform
    const actionType = this.action || 'next';
    
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
      <div class="action-button">
        <slot></slot>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('questionaire-action', QuestionaireAction);
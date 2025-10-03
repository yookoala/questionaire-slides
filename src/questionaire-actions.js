import { LitElement, html, css } from 'lit';

/**
 * Questionaire Actions Element
 * Container component to contain multiple button-like elements questionaire-action 
 * on the same row with a 1em gaps in-between by default.
 */
export class QuestionaireActions extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 1em 0;
    }

    .actions-container {
      display: flex;
      flex-direction: row;
      gap: 1em;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    /* When used with slot="bottom", ensure it's positioned at the bottom */
    :host([slot="bottom"]) {
      margin-top: auto;
      order: 999; /* Ensure it appears at the bottom */
    }

    /* Center the actions when used as bottom slot */
    :host([slot="bottom"]) .actions-container {
      justify-content: center;
    }

    /* Responsive behavior for very small screens */
    @media (max-width: 480px) {
      .actions-container {
        flex-direction: column;
        gap: 0.5em;
      }
      
      .actions-container ::slotted(questionaire-action) {
        width: 100%;
      }
    }
  `;

  render() {
    return html`
      <div class="actions-container">
        <slot></slot>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('questionaire-actions', QuestionaireActions);
import { LitElement, html, css } from 'lit';

/**
 * QuestionaireQuestion - A question container component with selectable answers
 * 
 * Features:
 * - Contains multiple questionaire-question-answer elements
 * - Supports single-select (default) and multi-select modes via multiselect attribute
 * - value property returns selected answer value(s) - string for single, array for multi
 * - Handles selection logic to enforce single vs multi-select rules
 * - Dispatches "question:changed" events when answers change
 */
export class QuestionaireQuestion extends LitElement {
  static properties = {
    multiselect: { type: Boolean, reflect: true },
    name: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.multiselect = false;
    this.name = '';
    this._observers = new Set();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupAnswerObservation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupObservers();
  }

  render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }

  /**
   * Handle slot changes to set up observers for new answer elements
   */
  _handleSlotChange() {
    this._cleanupObservers();
    this._setupAnswerObservation();
  }

  /**
   * Set up mutation observers for all answer elements
   */
  _setupAnswerObservation() {
    const answers = this._getAnswerElements();
    
    answers.forEach(answer => {
      // Create mutation observer for this answer element
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
            this._handleAnswerSelectionChange(answer);
          }
        });
      });

      // Observe attribute changes
      observer.observe(answer, {
        attributes: true,
        attributeFilter: ['selected']
      });

      this._observers.add(observer);
    });
  }

  /**
   * Clean up all mutation observers
   */
  _cleanupObservers() {
    this._observers.forEach(observer => {
      observer.disconnect();
    });
    this._observers.clear();
  }

  /**
   * Handle when an answer's selection state changes
   */
  _handleAnswerSelectionChange(changedAnswer) {
    const isSelected = changedAnswer.hasAttribute('selected');
    
    // If answer was selected and we're in single-select mode,
    // deselect all other answers
    if (isSelected && !this.multiselect) {
      const allAnswers = this._getAnswerElements();
      allAnswers.forEach(answer => {
        if (answer !== changedAnswer && answer.hasAttribute('selected')) {
          answer.removeAttribute('selected');
        }
      });
    }

    // Dispatch question:changed event
    this._dispatchQuestionChangedEvent(changedAnswer);
  }

  /**
   * Dispatch question:changed custom event
   */
  _dispatchQuestionChangedEvent(answerElement) {
    this.dispatchEvent(
      new CustomEvent('question:changed', {
        detail: { element: answerElement },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Get all questionaire-question-answer elements in this question
   */
  _getAnswerElements() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return [];
    
    return slot.assignedElements().filter(element => 
      element.tagName === 'QUESTIONAIRE-QUESTION-ANSWER'
    );
  }

  /**
   * Get the currently selected answer elements
   */
  _getSelectedAnswers() {
    return this._getAnswerElements().filter(answer => 
      answer.hasAttribute('selected')
    );
  }

  /**
   * Get the current value of the question
   * - In single-select mode: returns string value of selected answer, or undefined if none
   * - In multi-select mode: returns array of string values of selected answers, or empty array if none
   */
  get value() {
    const selectedAnswers = this._getSelectedAnswers();
    
    if (this.multiselect) {
      // Multi-select mode: return array of values
      return selectedAnswers.map(answer => answer.value);
    } else {
      // Single-select mode: return single value or undefined
      if (selectedAnswers.length > 0) {
        return selectedAnswers[0].value;
      }
      return undefined;
    }
  }

  /**
   * Get multiselect attribute as boolean
   */
  get multiselect() {
    return this.hasAttribute('multiselect');
  }

  /**
   * Set multiselect attribute
   */
  set multiselect(value) {
    if (value) {
      this.setAttribute('multiselect', '');
    } else {
      this.removeAttribute('multiselect');
    }
  }
}

customElements.define('questionaire-question', QuestionaireQuestion);
import { LitElement, html, css } from 'lit';
import { 
  QuestionValidationError, 
  QuestionNotAnsweredError, 
  QuestionAnsweredTooFewError, 
  QuestionAnsweredTooMuchError 
} from './question-validation-errors.js';

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
    minAnswer: { type: Number, attribute: 'min-answer', reflect: true },
    maxAnswer: { type: Number, attribute: 'max-answer', reflect: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .question-container {
      display: flex;
      flex-direction: column;
    }

    .question-content {
      flex: 1;
    }

    .question-bottom {
      margin-top: auto;
    }
  `;

  constructor() {
    super();
    this.multiselect = false;
    this.name = '';
    this.minAnswer = undefined;
    this.maxAnswer = undefined;
    this._observers = new Set();
  }

  connectedCallback() {
    super.connectedCallback();
    this._validateConstraints();
    this._setupAnswerObservation();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === 'min-answer' || name === 'max-answer') {
      this._validateConstraints();
    }
  }

  /**
   * Validate min-answer and max-answer constraints
   */
  _validateConstraints() {
    // Only validate constraints if the component is in multi-select mode
    if (!this.multiselect) {
      return;
    }

    // Validate min-answer is numerical if set
    if (this.minAnswer !== undefined && this.minAnswer !== null) {
      const minNum = Number(this.minAnswer);
      if (isNaN(minNum) || minNum < 0 || !Number.isInteger(minNum)) {
        throw new Error('min-answer must be a non-negative integer');
      }
    }

    // Validate max-answer is numerical if set
    if (this.maxAnswer !== undefined && this.maxAnswer !== null) {
      const maxNum = Number(this.maxAnswer);
      if (isNaN(maxNum) || maxNum < 0 || !Number.isInteger(maxNum)) {
        throw new Error('max-answer must be a non-negative integer');
      }
    }

    // Validate min-answer <= max-answer if both are set
    if (this.minAnswer !== undefined && this.maxAnswer !== undefined) {
      const minNum = Number(this.minAnswer);
      const maxNum = Number(this.maxAnswer);
      if (minNum > maxNum) {
        throw new Error('min-answer cannot be greater than max-answer');
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupObservers();
  }

  render() {
    return html`
      <div class="question-container">
        <div class="question-content">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class="question-bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    `;
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
    const slot = this.shadowRoot?.querySelector('slot:not([name])');
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

  /**
   * Validate the current question state
   * Throws appropriate validation errors if the question is not valid
   */
  validate() {
    if (this.multiselect) {
      // Multi-select validation
      const selectedAnswers = this._getSelectedAnswers();
      const selectedCount = selectedAnswers.length;

      // Check minimum constraint
      if (this.minAnswer !== undefined && this.minAnswer !== null) {
        const minRequired = Number(this.minAnswer);
        if (selectedCount < minRequired) {
          throw new QuestionAnsweredTooFewError(
            `You must at lease select ${minRequired} answer(s)`,
            minRequired
          );
        }
      }

      // Check maximum constraint
      if (this.maxAnswer !== undefined && this.maxAnswer !== null) {
        const maxAllowed = Number(this.maxAnswer);
        if (selectedCount > maxAllowed) {
          throw new QuestionAnsweredTooMuchError(
            `You must select no more than ${maxAllowed} answer(s)`,
            maxAllowed
          );
        }
      }
    } else {
      // Single-select validation
      const value = this.value;
      if (value === undefined) {
        throw new QuestionNotAnsweredError('A value must be selected');
      }
    }

    // If we get here, validation passed
    return true;
  }
}

customElements.define('questionaire-question', QuestionaireQuestion);
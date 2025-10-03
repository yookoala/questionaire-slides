import { LitElement, html, css } from 'lit';

/**
 * QuestionaireQuestionAnswer - A selectable answer option component
 * 
 * Features:
 * - Container element for answer text with selection state
 * - "selected" attribute reflects selection state
 * - "value" property/attribute for submission values
 * - If no value attribute is set, value property returns text content
 * - Programmatic value changes only affect attribute, not text content
 */
export class QuestionaireQuestionAnswer extends LitElement {
  static properties = {
    selected: { type: Boolean, reflect: true },
    value: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.selected = false;
    this._initialValueSet = false;
  }

  firstUpdated() {
    // If no value attribute was set initially, use text content as value
    if (!this._initialValueSet && !this.hasAttribute('value')) {
      const textContent = this.textContent;
      this._value = textContent ? textContent.trim() : '';
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  /**
   * Custom getter for value property
   * Returns the value attribute if set, otherwise returns text content
   */
  get value() {
    // If value was set programmatically or via attribute, return that
    if (this.hasAttribute('value')) {
      return this.getAttribute('value');
    }
    
    // If _value was set internally, return that
    if (this._value !== undefined) {
      return this._value;
    }
    
    // Otherwise return current text content (handle null/undefined)
    const textContent = this.textContent;
    return textContent ? textContent.trim() : '';
  }

  /**
   * Custom setter for value property
   * Sets the value attribute, which doesn't affect text content
   */
  set value(newValue) {
    if (newValue === null || newValue === undefined) {
      this.removeAttribute('value');
    } else {
      this.setAttribute('value', String(newValue));
    }
    this._initialValueSet = true;
  }

  /**
   * Override attributeChangedCallback to handle value attribute changes
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value') {
      this._initialValueSet = true;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  /**
   * Get the currently selected state
   */
  get selected() {
    return this.hasAttribute('selected');
  }

  /**
   * Set the selected state
   */
  set selected(value) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }
}

customElements.define('questionaire-question-answer', QuestionaireQuestionAnswer);
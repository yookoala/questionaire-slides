import { LitElement, html, css } from 'lit';

/**
 * QuestionaireQuestionContent - A simple container component for question text/HTML content
 * 
 * Features:
 * - Simple container element for displaying question text or HTML
 * - Used within questionaire-question elements to show the question content
 * - Supports any HTML content via slots
 * - Does not affect question logic - purely for display purposes
 */
export class QuestionaireQuestionContent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('questionaire-question-content', QuestionaireQuestionContent);
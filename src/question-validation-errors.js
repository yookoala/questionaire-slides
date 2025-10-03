/**
 * Custom error classes for questionnaire validation
 */

/**
 * Base error class for all question validation errors
 */
export class QuestionValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QuestionValidationError';
    
    // Maintain proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuestionValidationError);
    }
  }
}

/**
 * Error thrown when a single-select question has no answer selected
 */
export class QuestionNotAnsweredError extends QuestionValidationError {
  constructor(message = 'A value must be selected') {
    super(message);
    this.name = 'QuestionNotAnsweredError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuestionNotAnsweredError);
    }
  }
}

/**
 * Error thrown when a multi-select question has too few answers selected
 */
export class QuestionAnsweredTooFewError extends QuestionValidationError {
  constructor(message, minRequired) {
    if (!message && minRequired !== undefined) {
      message = `You must at lease select ${minRequired} answer(s)`;
    }
    super(message);
    this.name = 'QuestionAnsweredTooFewError';
    this.minRequired = minRequired;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuestionAnsweredTooFewError);
    }
  }
}

/**
 * Error thrown when a multi-select question has too many answers selected
 */
export class QuestionAnsweredTooMuchError extends QuestionValidationError {
  constructor(message, maxAllowed) {
    if (!message && maxAllowed !== undefined) {
      message = `You must select no more than ${maxAllowed} answer(s)`;
    }
    super(message);
    this.name = 'QuestionAnsweredTooMuchError';
    this.maxAllowed = maxAllowed;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuestionAnsweredTooMuchError);
    }
  }
}

// Make error classes available globally for testing
if (typeof window !== 'undefined') {
  window.QuestionValidationError = QuestionValidationError;
  window.QuestionNotAnsweredError = QuestionNotAnsweredError;
  window.QuestionAnsweredTooFewError = QuestionAnsweredTooFewError;
  window.QuestionAnsweredTooMuchError = QuestionAnsweredTooMuchError;
}
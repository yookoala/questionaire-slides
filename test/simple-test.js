// Simple test to verify the components can be loaded and basic API works
import { QuestionaireContainer } from '../src/questionaire-container.js';
import { QuestionaireQuestionAnswer } from '../src/questionaire-question-answer.js';
import { QuestionaireQuestion } from '../src/questionaire-question.js';
import { QuestionaireQuestionContent } from '../src/questionaire-question-content.js';

console.log('Testing questionaire components...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ PASS: ${name}`);
        passed++;
    } catch (e) {
        console.log(`✗ FAIL: ${name}`);
        console.log(`  Error: ${e.message}`);
        failed++;
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

console.log(`\n=== QuestionaireContainer Tests ===`);

// Test 1: Component should be defined
test('QuestionaireContainer should be defined', () => {
    assertEquals(typeof QuestionaireContainer, 'function', 'QuestionaireContainer should be a function/class');
});

// Test 2: Component should have correct properties
test('QuestionaireContainer should have expected static properties', () => {
    assertEquals(typeof QuestionaireContainer.properties, 'object', 'Should have properties definition');
});

// Test 3: Custom element should be registered
test('Custom element "questionaire-container" should be registered', () => {
    const defined = customElements.get('questionaire-container');
    assertEquals(defined, QuestionaireContainer, 'Custom element should be registered');
});

// Test 4: Component can be instantiated
test('QuestionaireContainer can be instantiated', () => {
    const instance = new QuestionaireContainer();
    assertEquals(typeof instance, 'object', 'Should create an instance');
    assertEquals(instance.currentIndex, 0, 'Should have currentIndex property set to 0');
});

// Test 5: Component has required methods
test('QuestionaireContainer should have required methods', () => {
    const instance = new QuestionaireContainer();
    assertEquals(typeof instance.next, 'function', 'Should have next method');
    assertEquals(typeof instance.previous, 'function', 'Should have previous method');
    assertEquals(typeof instance.goToSlide, 'function', 'Should have goToSlide method');
    assertEquals(typeof instance.getContents, 'function', 'Should have getContents method');
});

console.log(`\n=== QuestionaireQuestionAnswer Tests ===`);

// Test 6: Answer component should be defined
test('QuestionaireQuestionAnswer should be defined', () => {
    assertEquals(typeof QuestionaireQuestionAnswer, 'function', 'QuestionaireQuestionAnswer should be a function/class');
});

// Test 7: Answer component should have correct properties
test('QuestionaireQuestionAnswer should have expected static properties', () => {
    assertEquals(typeof QuestionaireQuestionAnswer.properties, 'object', 'Should have properties definition');
});

// Test 8: Custom element should be registered
test('Custom element "questionaire-question-answer" should be registered', () => {
    const defined = customElements.get('questionaire-question-answer');
    assertEquals(defined, QuestionaireQuestionAnswer, 'Custom element should be registered');
});

// Test 9: Answer component can be instantiated
test('QuestionaireQuestionAnswer can be instantiated', () => {
    const instance = new QuestionaireQuestionAnswer();
    assertEquals(typeof instance, 'object', 'Should create an instance');
    assertEquals(instance.selected, false, 'Should have selected property set to false');
});

// Test 10: Answer component has correct property behavior
test('QuestionaireQuestionAnswer should have proper value behavior', () => {
    const instance = new QuestionaireQuestionAnswer();
    
    // Test selected property
    assertEquals(typeof instance.selected, 'boolean', 'Selected should be boolean');
    
    // Test value property exists
    assertEquals(typeof instance.value, 'string', 'Value should be string');
});

console.log(`\n=== QuestionaireQuestion Tests ===`);

// Test 11: Question component should be defined
test('QuestionaireQuestion should be defined', () => {
    assertEquals(typeof QuestionaireQuestion, 'function', 'QuestionaireQuestion should be a function/class');
});

// Test 12: Question component should have correct properties
test('QuestionaireQuestion should have expected static properties', () => {
    assertEquals(typeof QuestionaireQuestion.properties, 'object', 'Should have properties definition');
});

// Test 13: Custom element should be registered
test('Custom element "questionaire-question" should be registered', () => {
    const defined = customElements.get('questionaire-question');
    assertEquals(defined, QuestionaireQuestion, 'Custom element should be registered');
});

// Test 14: Question component can be instantiated
test('QuestionaireQuestion can be instantiated', () => {
    const instance = new QuestionaireQuestion();
    assertEquals(typeof instance, 'object', 'Should create an instance');
    assertEquals(instance.multiselect, false, 'Should have multiselect property set to false');
});

// Test 15: Question component has correct property behavior
test('QuestionaireQuestion should have proper value behavior', () => {
    const instance = new QuestionaireQuestion();
    
    // Test multiselect property
    assertEquals(typeof instance.multiselect, 'boolean', 'Multiselect should be boolean');
    
    // For value property, we need to mock the shadow root behavior since it's not connected to DOM
    // In real usage, this would work after the component is connected
    assertEquals(typeof instance.value, 'undefined', 'Value should be undefined when no answers available');
});

console.log(`\n=== QuestionaireQuestionContent Tests ===`);

// Test 16: Content component should be defined
test('QuestionaireQuestionContent should be defined', () => {
    assertEquals(typeof QuestionaireQuestionContent, 'function', 'QuestionaireQuestionContent should be a function/class');
});

// Test 17: Content component should have correct properties
test('QuestionaireQuestionContent should have expected static properties', () => {
    assertEquals(typeof QuestionaireQuestionContent.styles, 'object', 'Should have styles definition');
});

// Test 18: Custom element should be registered
test('Custom element "questionaire-question-content" should be registered', () => {
    const defined = customElements.get('questionaire-question-content');
    assertEquals(defined, QuestionaireQuestionContent, 'Custom element should be registered');
});

// Test 19: Content component can be instantiated
test('QuestionaireQuestionContent can be instantiated', () => {
    const instance = new QuestionaireQuestionContent();
    assertEquals(typeof instance, 'object', 'Should create an instance');
});

// Test 20: Content component should be simple container
test('QuestionaireQuestionContent should be a simple container', () => {
    const instance = new QuestionaireQuestionContent();
    
    // Content component should be simple and not have complex logic
    assertEquals(typeof instance.render, 'function', 'Should have render method from LitElement');
});

// Test 21: Container getContents method
test('QuestionaireContainer should have getContents method', () => {
    const instance = new QuestionaireContainer();
    assertEquals(typeof instance.getContents, 'function', 'Should have getContents method');
    
    // For unit test, method should return empty string when not connected to DOM
    assertEquals(instance.getContents(), '', 'Should return empty string when no content available');
});

// Test 22: Question component should have name attribute support
test('QuestionaireQuestion should support name attribute', () => {
    const instance = new QuestionaireQuestion();
    assertEquals(typeof instance.name, 'string', 'Should have name property');
    assertEquals(instance.name, '', 'Should default to empty string');
});

// Test 23: Container values property
test('QuestionaireContainer should have values property', () => {
    const instance = new QuestionaireContainer();
    assertEquals(typeof instance.values, 'object', 'Should have values property');
    assertEquals(instance.values !== null, true, 'values should not be null');
    
    // For unit test, property should return empty object when not connected to DOM
    assertEquals(JSON.stringify(instance.values), '{}', 'Should return empty object when no questions available');
});

console.log(`\n=== Test Results ===`);
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}

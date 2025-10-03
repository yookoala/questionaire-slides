// Simple test to verify the components can be loaded and basic API works
import { QuestionaireContainer } from '../src/questionaire-container.js';
import { QuestionaireQuestionAnswer } from '../src/questionaire-question-answer.js';

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

console.log(`\n=== Test Results ===`);
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}

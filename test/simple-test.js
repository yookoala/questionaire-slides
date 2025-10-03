// Simple test to verify the component can be loaded and basic API works
import { QuestionaireContainer } from '../src/questionaire-container.js';

console.log('Testing QuestionaireContainer component...\n');

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

console.log(`\n=== Test Results ===`);
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}

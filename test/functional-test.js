// Functional test for carousel behavior using JSDOM
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost/',
});

global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;

// Import the component after setting up the DOM
const { QuestionaireContainer } = await import('../src/questionaire-container.js');

console.log('Testing QuestionaireContainer carousel functionality...\n');

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

// Create a container with slides
const container = document.createElement('questionaire-container');
const slide1 = document.createElement('div');
slide1.textContent = 'Slide 1';
const slide2 = document.createElement('div');
slide2.textContent = 'Slide 2';
const slide3 = document.createElement('div');
slide3.textContent = 'Slide 3';

container.appendChild(slide1);
container.appendChild(slide2);
container.appendChild(slide3);
document.body.appendChild(container);

// Wait for component to initialize
await new Promise(resolve => setTimeout(resolve, 100));

test('Initial index should be 0', () => {
    assertEquals(container.currentIndex, 0);
});

test('Should move to next slide', () => {
    container.next();
    assertEquals(container.currentIndex, 1);
});

test('Should move to previous slide', () => {
    container.previous();
    assertEquals(container.currentIndex, 0);
});

test('Should not go below 0', () => {
    container.previous();
    assertEquals(container.currentIndex, 0);
});

test('Should move through all slides', () => {
    container.next();
    container.next();
    assertEquals(container.currentIndex, 2);
});

test('Should not go beyond last slide', () => {
    container.next();
    assertEquals(container.currentIndex, 2);
});

test('Should jump to specific slide', () => {
    container.goToSlide(1);
    assertEquals(container.currentIndex, 1);
});

test('Should have correct slideCount', () => {
    assertEquals(container.slideCount, 3);
});

console.log(`\n=== Test Results ===`);
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}

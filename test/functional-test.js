// Functional test for carousel behavior using JSDOM
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost/',
});

global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;

describe('QuestionaireContainer Carousel Functionality', () => {
    let container, slide1, slide2, slide3, QuestionaireContainer;

    before(async () => {
        // Import the component after setting up the DOM
        const module = await import('../src/questionaire-container.js');
        QuestionaireContainer = module.QuestionaireContainer;
        
        // Create a container with slides
        container = document.createElement('questionaire-container');
        slide1 = document.createElement('div');
        slide1.textContent = 'Slide 1';
        slide2 = document.createElement('div');
        slide2.textContent = 'Slide 2';
        slide3 = document.createElement('div');
        slide3.textContent = 'Slide 3';

        container.appendChild(slide1);
        container.appendChild(slide2);
        container.appendChild(slide3);
        document.body.appendChild(container);

        // Wait for component to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have initial index of 0', () => {
        expect(container.currentIndex).to.equal(0);
    });

    it('should move to next slide', () => {
        container.next();
        expect(container.currentIndex).to.equal(1);
    });

    it('should move to previous slide', () => {
        container.previous();
        expect(container.currentIndex).to.equal(0);
    });

    it('should not go below 0', () => {
        container.previous();
        expect(container.currentIndex).to.equal(0);
    });

    it('should move through all slides', () => {
        container.next();
        container.next();
        expect(container.currentIndex).to.equal(2);
    });

    it('should not go beyond last slide', () => {
        container.next();
        expect(container.currentIndex).to.equal(2);
    });

    it('should jump to specific slide', () => {
        container.goToSlide(1);
        expect(container.currentIndex).to.equal(1);
    });

    it('should have correct slideCount', () => {
        expect(container.slideCount).to.equal(3);
    });
});

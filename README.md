# Questionaire Slides Web Components

A set of web components for building interactive questionaires with a carousel interface.

## Project Structure

- `/src` - Library files (web component implementations)
- `/test` - Test files
- `/examples` - Example HTML files demonstrating component usage
- `/dist` - Distributed/bundled files (when needed)

## Components

### `<questionaire-container>`

A carousel component that displays child elements one at a time, allowing navigation between them.

**Features:**
- Shows only one child element at a time
- Navigation methods: `next()`, `previous()`, `goToSlide(index)`
- Emits `slide-changed` event when navigation occurs
- Provides `currentIndex` property for tracking current slide
- Provides `slideCount` getter for total number of slides

**Usage:**

```html
<script type="module" src="./src/questionaire-container.js"></script>

<questionaire-container>
  <div>Slide 1 content</div>
  <div>Slide 2 content</div>
  <div>Slide 3 content</div>
</questionaire-container>

<script>
  const container = document.querySelector('questionaire-container');
  
  // Navigate to next slide
  container.next();
  
  // Navigate to previous slide
  container.previous();
  
  // Jump to specific slide
  container.goToSlide(2);
  
  // Listen for slide changes
  container.addEventListener('slide-changed', (e) => {
    console.log('Current slide index:', e.detail.index);
  });
</script>
```

## Installation

```bash
npm install
```

## Testing

Run the automated tests:

```bash
npm test
```

For browser-based testing with visual feedback, open `test/questionaire-container.test.html` in a web browser.

## Examples

See the `examples/` directory for working examples:
- `carousel-example.html` - Basic carousel demonstration with navigation buttons

## Development

This project uses:
- [Lit](https://lit.dev/) - For building web components
- ES Modules - For JavaScript module system
- Web Components - Native browser custom elements API

## License

This software is licensed under the MIT License. A copy of the license is distributed along with the source code [here](LICENSE).

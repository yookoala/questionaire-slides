# Custom Elements Manifest

This project includes a `custom-elements.json` file that follows the [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/) standard by open-wc.org.

## What is Custom Elements Manifest?

The Custom Elements Manifest is a file format that describes custom elements in your project. It provides detailed information about:

- **Components**: All web components with their tag names and descriptions
- **Properties**: Component properties, their types, default values, and whether they reflect to attributes
- **Methods**: Public methods available on each component
- **Events**: Custom events fired by components with their detail types
- **Slots**: Available slots for content projection
- **CSS Custom Properties**: Custom CSS properties (if any)

## Generated Documentation

The `custom-elements.json` file documents all questionnaire components:

### Components Documented

1. **`<questionaire-container>`** - Main carousel container
   - Properties: `currentIndex`, `ready`, `slideCount`, `values`
   - Methods: `next()`, `previous()`, `goToSlide()`, `current()`, `getContents()`
   - Events: `container:changed`

2. **`<questionaire-question>`** - Question container with validation
   - Properties: `multiselect`, `name`, `minAnswer`, `maxAnswer`, `value`
   - Methods: `validate()`
   - Events: `question:changed`
   - Slots: default content area, `bottom` slot

3. **`<questionaire-question-answer>`** - Selectable answer option
   - Properties: `selected`, `value`
   - Events: `question:changed`, `container:changed`

4. **`<questionaire-question-content>`** - Question text container
   - Simple content container

5. **`<questionaire-action>`** - Navigation button
   - Properties: `action`, `disabled`

6. **`<questionaire-actions>`** - Action buttons container
   - Grid layout container

### Error Classes

The manifest also documents validation error classes:
- `QuestionValidationError` (base class)
- `QuestionNotAnsweredError`
- `QuestionAnsweredTooFewError`
- `QuestionAnsweredTooMuchError`

## Usage

Tools and IDEs that support Custom Elements Manifest can use this file to provide:
- **IntelliSense/Autocomplete**: Property and method suggestions
- **Type checking**: Validation of component usage
- **Documentation**: Inline documentation in editors
- **Storybook integration**: Automatic component documentation
- **Web Components Analyzer**: Better analysis and tooling

## Updating the Manifest

The Custom Elements Manifest is generated from the built files in `dist/` (excluding minified versions):

```bash
# Build dist files and regenerate manifest
npm run analyze

# Or run steps separately
npm run build
npx cem analyze --config custom-elements-manifest.config.js
```

The manifest is automatically regenerated during the publish process and included in builds and npm packages.

## Tool Support

This manifest works with:
- [Custom Elements Language Service](https://github.com/runem/web-component-analyzer)
- [lit-analyzer](https://github.com/runem/lit-analyzer)
- [VS Code Custom Data](https://github.com/microsoft/vscode-custom-data)
- [Storybook](https://storybook.js.org/docs/web-components/writing-docs/autodocs)
- Various other web component development tools
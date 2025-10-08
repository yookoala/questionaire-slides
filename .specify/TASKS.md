# TODO

Steps to implement the applicaiton.

- [x] feature/carousel: Implement `<questionaire-container>` as an HTML carousel.
- [x] feature/answer: Implement `<questionaire-question-answer>` element.
- [x] feature/question-and-answer: Implement `<questionaire-question>` logics with only `<questionaire-question-answer>` in it.
- [x] feature/question-content-and-answer: Implement `<questionaire-question>` logics with both
`<questionaire-question-answer>` and `<questionaire-question-content>` in it.
- [x] feature/question-container--getcontents: Implement the `<questionaire-container>` getContents method.
- [x] feature/question-container--values: Implement the `<questionaire-container>` values readonly property.
- [x] feature/question--validate: Implement the `.validate()` method for `<questionaire-question>`, along with all the custom error classes.
- [x] feature/question-container--current: Implement the `.current()` method for `<questionaire-container>`
- [x] feature/question-container--next-validate: Update the `.next()` method for `<questionaire-container>` to implement the validation logics.
- [x] feature/question-action: Implement the `<questionaire-action>` element.
- [x] feature/question-actions: Implement the `<questionaire-actions>` element (with `<questionaire-action>` in side in example to show the layout ability).
- [x] fix/layout: currently all horizontal layout are using flex. This is not good because any padding of child element will mess up the layout. Change all "flex" usage into CSS grid. `<questionaire-container>` should have the child elements dynamically determined to have a proper `grid-column` of exactly the correct number of `repeat()` of `1fr` to set inline for `.container` in the shadow DOM.
- [x] feature/question-action-validate: Implement the interaction between `<questionaire-action>` and `<questionaire-container>` to have `<questionaire-action>` (action="next") disabled when the current question's `.validate()` raises error. Make sure this change don't break anything implemented before.
- [x] fix/style: "div.action-button" in `<questionaire-action>` should not exists. It should be done by styling the :host directly. Fix this without messing up existing feature.
- [x] qa/check-mit-license-compat: Check the source code with GitHub or other available code source to see if the current source code is compatible with a MIT license release.
- [x] qa/tests: write automatic test with @playwright/test using headless chrome / chromium on all test/*.html to ensure they behaves as expected.
- [x] qa/test-rewrite: rewrite simple-test.js and functional-test.js (both in the "test/" folder) with chai+mocha.
- [x] qa/github-actions: setup repository to run all tests in GitHub Actions when a new commit is on "main" branch or when a PR on "main" is submitted.
- [x] publish/npm-ready: a new script to generate "dist/" folder of the "src/*.js", and minified versions of them, with proper library version comment header that are generated dynamically.
- [x] fix/answer-example: in the example, the click behaviour was added in line 207-212. This click-select behaviour should be part of the QuestionaireQuestionAnswer class instead.
- [x] fix/questionaire-question-answer-select: in existing tests and examples, there are script that rely on explicit event listener for answer's click. But after the last task, the behaviour is added to the element. Remove obsoleted code or modify code for the new behaviour. 
- [ ] feature/questionaire-question-answer--bubbling-change-event: in QuestionaireQuestionAnswer, I've added a bubbling change event when clicked. Modify existing tests for container, question and answer to detect such event.

Note: Do not do anything that is not in this file.

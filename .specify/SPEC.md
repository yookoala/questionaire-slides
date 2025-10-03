# Specification

This project is to build a set of web components that works together as a questionaire.


## Folder Strucutre

- All library files are to be stored in the "/src" subfolder.
- All tests are to be stored in the "/test" subfolder.
- All example files are to be stored in the "/examples" subfolder.
- If things needed to be bundled for release, the distributed files are to be stored in the "/dist" folder.


## Components

* `<questionaire-container>`
  The outest component to container the whole questionaire. It should act as a carousel of all the child element to only show one of them at a time.

  Each of this element have a `getContents` method. When called, it will return an aggregated "\n" separated children `<questionaire-question-content>` innerText value(s).

  Each of this element have a readonly `values` property. Everytime when read, it should aggregate all the children `<questionaire-question>` elements that has a non-empty "name" attribute / property set. It will build, sequencially by element order, a key-value object with "name" as the keys and the `<questionaire-question>`'s `.value` property evaluation result as the values, and then return the just built object.

* `<questionaire-question>`
  The question-level, or "slide"-level, component to show a question and selectable answers. This question will have multiple answers available for selection. Questions can either be a single-selected or multiple-selected MC question.

  Each of this element have an optional "name" property / attribute.

  Each of this element have an optional "multiselect" property / attribute. When set, this element is "mult-selected mode". If not set, this element is "single-selected mode".

  Each of this element will have a read-only "value" property. When read, it should look for the children elements to find any selected answer.
  
    - In "mult-selected mode", the "value" property will return an array of string from all "value" property of the selected answers. If none is selected, then it should return an empty array.

    - In "single-selected mode", the "value" property will return the string from the only selected answer, or the global `undefined` object if none is selected.

* `<questionaire-question-content>`
  Each `<questionaire-question>` will contain multiple of this. This is for showing the question text or other HTML element to display the question with.

* `<questionaire-question-answer>`
  Each `<questionaire-question>` will contain multiple of this component. Each of this component will hold the answer text and an optional "value" attribute.

  Each `<questionaire-question-answer>` element is a simple container element with an additional properties / attributes:
  - "selected": Only present if a user explicitly selected it.
  - "value": Optional attribute but always presents in properties. If the value attribute is not set, then reading the property will give the current inner text of the element. If the property is programatically set or modified, only the attribute is affected while the inner text is kept untouched.

  When a `<questionaire-question-answer>` is seleted, the answer is liable to find the closest `<questionaire-question>` parent element, dispatch a "question:changed" custom event on the parent with `.detail.element` set to the answer element.

  When a `<questionaire-question-answer>` is seleted, the answer is liable to check the "single-selected" or "multi-selected" mode of the closest `<questionaire-question>` parent element, if exists. It should unselect all `<questionaire-question-answer>` in the same `<questionaire-question>` parent before selecting itself.

* `<questionaire-question-actions>`
  Each `<questionaire-question>` may contain one of this. A div container component to contain multiple buttons. Will take up the bottom of the question element.

* `<questionaire-question-actions-action>`
  Each `<questionaire-question-actions>` will contain one or more of this. A button-like element to be shown to user for navigation.
  
  Each may container an optional "action" attribute. The value of the attribute can be "next" or "previous". If not specified, the attribute is treated as "next".


## Procedure for Each Step

1. Create an example HTML.
2. Create browser test around the example HTML.
3. Draft summary of the changes so far.
4. Commit to git.
3. Implement the feature mentioned in the step.
4. Draft summary of the changes so far.
5. Commit to git.
6. Check with test.
7. If there is anything wrong with test result, modify src to fix it.
8. Repeat 6 and 7 until all tests are fixed.
9. Draft summary of the changes so far.
10. Commit to git.
11. Report to user. And then stop until user's next instructions.


## Example of Final Outcome

```html
<questionaire-container>

    <questionaire-question>
        <questionaire-question-content>
            How often do you go to the gym?
        </questionaire-question-content>
        <questionaire-question-answer selected-value="never">
            Never
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="year">
            Once or more per year
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="month">
            Once or more per month
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="week">
            Once or more per week
        </questionaire-question-answer>
        <questionaire-question-actions>
            <questionaire-question-actions>
                Next
            </questionaire-question-actions>
        </questionaire-question-actions>
    </questionaire-question>

    <questionaire-question>
        <questionaire-question-content>
            How much time do you spend on exercise in gym each time?
        </questionaire-question-content>
        <questionaire-question-answer selected-value="0">
            None
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="15">
            Less than 15 minutes
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="30">
            15 - 30 minutes
        </questionaire-question-answer>
        <questionaire-question-answer selected-value="60">
            30 minutes - 1 hour
        </questionaire-question-answer>
        <questionaire-question-answer selected-value=">60">
            More than 1 hour
        </questionaire-question-answer>
        <questionaire-question-actions>
            <questionaire-question-actions action="previous">
                Previous
            </questionaire-question-actions>
            <questionaire-question-actions>
                Next
            </questionaire-question-actions>
        </questionaire-question-actions>
    </questionaire-question>

</questionaire-container>
```

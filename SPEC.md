# Specification

This project is to build a set of web components that works together as a questionaire.


## Folder Strucutre

- All library files are to be stored in the "/src" subfolder.
- All tests are to be stored in the "/test" subfolder.
- All example files are to be stored in the "/examples" subfolder.
- If things needed to be bundled for release, the distributed files are to be stored in the "/dist" folder.


## Components

* `<questionaire-container>`
  The outest component to container the whole questionaire.

* `<questionaire-question>`
  The question-level, or "slide"-level, component to show a question and selectable answers. This question will have multiple answers available for selection. Questions can either be a single-selected or multiple-selected MC question.

* `<questionaire-question-content>`
  Each `<questionaire-question>` will contain multiple of this. This is for showing the question text or other HTML element to display the question with.

* `<questionaire-question-answer>`
  Each `<questionaire-question>` will contain multiple of this component. Each of this component will hold the answer text, the status if it is selected, and an optional "selected-value" attribute to submit as value if the answer is selected. If "selected-value" is not set, the value will be that of the `<questionaire-question-content>` element.

* `<questionaire-question-actions>`
  Each `<questionaire-question>` may contain one of this. A div container component to contain multiple buttons. Will take up the bottom of the question element.

* `<questionaire-question-actions-action>`
  Each `<questionaire-question-actions>` will contain one or more of this. A button-like element to be shown to user for navigation.
  
  Each may container an optional "action" attribute. The value of the attribute can be "next" or "previous". If not specified, the attribute is treated as "next".


## Example

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
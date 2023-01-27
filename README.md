# React Autocomplete

You have an array of people. Implement the Autocomplete component
using [Bulma Dropdown](https://bulma.io/documentation/components/dropdown/)
that will suggest people matching an entered text.

> The task does not have tests or a working example

- suggestions should appear after some `delay` in typing (`debounce`);
- the `delay` should be customizable via props;
- show `No matching suggestions` message if there are no people containing the entered text;
- don't run filtering again if the text has not changed (pause in typing happened when the text was the same as before)
- hide suggestions on text change;
- save selected suggestion text to the input on click and close the list;
- pass selected person to the `onSelected` callback passed via props;
- add an `h1` to the `App` showing `Name (born - died)` of the selected person or `No selected person`.

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://UmizDemud.github.io/react_autocomplete/) and add it to the PR description.

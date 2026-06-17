This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*, README.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
src/
  data/
    people.ts
  types/
    Person.ts
  App.scss
  App.tsx
  index.tsx
  vite-env.d.ts
README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/data/people.ts">
import { Person } from '../types/Person';

export const peopleFromServer: Person[] = [
  {
    name: 'Carolus Haverbeke',
    sex: 'm',
    born: 1832,
    died: 1905,
    fatherName: 'Carel Haverbeke',
    motherName: 'Maria van Brussel',
    slug: 'carolus-haverbeke-1832',
  },
  {
    name: 'Emma de Milliano',
    sex: 'f',
    born: 1876,
    died: 1956,
    fatherName: 'Petrus de Milliano',
    motherName: 'Sophia van Damme',
    slug: 'emma-de-milliano-1876',
  },
  {
    name: 'Maria de Rycke',
    sex: 'f',
    born: 1683,
    died: 1724,
    fatherName: 'Frederik de Rycke',
    motherName: 'Laurentia van Vlaenderen',
    slug: 'maria-de-rycke-1683',
  },
  {
    name: 'Jan van Brussel',
    sex: 'm',
    born: 1714,
    died: 1748,
    fatherName: 'Jacobus van Brussel',
    motherName: 'Joanna van Rooten',
    slug: 'jan-van-brussel-1714',
  },
  {
    name: 'Philibert Haverbeke',
    sex: 'm',
    born: 1907,
    died: 1997,
    fatherName: 'Emile Haverbeke',
    motherName: 'Emma de Milliano',
    slug: 'philibert-haverbeke-1907',
  },
  {
    name: 'Jan Frans van Brussel',
    sex: 'm',
    born: 1761,
    died: 1833,
    fatherName: 'Jacobus Bernardus van Brussel',
    motherName: null,
    slug: 'jan-frans-van-brussel-1761',
  },
  {
    name: 'Pauwels van Haverbeke',
    sex: 'm',
    born: 1535,
    died: 1582,
    fatherName: 'N. van Haverbeke',
    motherName: null,
    slug: 'pauwels-van-haverbeke-1535',
  },
  {
    name: 'Clara Aernoudts',
    sex: 'f',
    born: 1918,
    died: 2012,
    fatherName: 'Henry Aernoudts',
    motherName: 'Sidonie Coene',
    slug: 'clara-aernoudts-1918',
  },
  {
    name: 'Emile Haverbeke',
    sex: 'm',
    born: 1877,
    died: 1968,
    fatherName: 'Carolus Haverbeke',
    motherName: 'Maria Sturm',
    slug: 'emile-haverbeke-1877',
  },
  {
    name: 'Lieven de Causmaecker',
    sex: 'm',
    born: 1696,
    died: 1724,
    fatherName: 'Carel de Causmaecker',
    motherName: 'Joanna Claes',
    slug: 'lieven-de-causmaecker-1696',
  },
  {
    name: 'Pieter Haverbeke',
    sex: 'm',
    born: 1602,
    died: 1642,
    fatherName: 'Lieven van Haverbeke',
    motherName: null,
    slug: 'pieter-haverbeke-1602',
  },
  {
    name: 'Livina Haverbeke',
    sex: 'f',
    born: 1692,
    died: 1743,
    fatherName: 'Daniel Haverbeke',
    motherName: 'Joanna de Pape',
    slug: 'livina-haverbeke-1692',
  },
  {
    name: 'Pieter Bernard Haverbeke',
    sex: 'm',
    born: 1695,
    died: 1762,
    fatherName: 'Willem Haverbeke',
    motherName: 'Petronella Wauters',
    slug: 'pieter-bernard-haverbeke-1695',
  },
  {
    name: 'Lieven van Haverbeke',
    sex: 'm',
    born: 1570,
    died: 1636,
    fatherName: 'Pauwels van Haverbeke',
    motherName: 'Lievijne Jans',
    slug: 'lieven-van-haverbeke-1570',
  },
  {
    name: 'Joanna de Causmaecker',
    sex: 'f',
    born: 1762,
    died: 1807,
    fatherName: 'Bernardus de Causmaecker',
    motherName: null,
    slug: 'joanna-de-causmaecker-1762',
  },
  {
    name: 'Willem Haverbeke',
    sex: 'm',
    born: 1668,
    died: 1731,
    fatherName: 'Lieven Haverbeke',
    motherName: 'Elisabeth Hercke',
    slug: 'willem-haverbeke-1668',
  },
  {
    name: 'Pieter Antone Haverbeke',
    sex: 'm',
    born: 1753,
    died: 1798,
    fatherName: 'Jan Francies Haverbeke',
    motherName: 'Petronella de Decker',
    slug: 'pieter-antone-haverbeke-1753',
  },
  {
    name: 'Maria van Brussel',
    sex: 'f',
    born: 1801,
    died: 1834,
    fatherName: 'Jan Frans van Brussel',
    motherName: 'Joanna de Causmaecker',
    slug: 'maria-van-brussel-1801',
  },
  {
    name: 'Angela Haverbeke',
    sex: 'f',
    born: 1728,
    died: 1734,
    fatherName: 'Pieter Bernard Haverbeke',
    motherName: 'Livina de Vrieze',
    slug: 'angela-haverbeke-1728',
  },
  {
    name: 'Elisabeth Haverbeke',
    sex: 'f',
    born: 1711,
    died: 1754,
    fatherName: 'Jan Haverbeke',
    motherName: 'Maria de Rycke',
    slug: 'elisabeth-haverbeke-1711',
  },
  {
    name: 'Lievijne Jans',
    sex: 'f',
    born: 1542,
    died: 1582,
    fatherName: null,
    motherName: null,
    slug: 'lievijne-jans-1542',
  },
  {
    name: 'Bernardus de Causmaecker',
    sex: 'm',
    born: 1721,
    died: 1789,
    fatherName: 'Lieven de Causmaecker',
    motherName: 'Livina Haverbeke',
    slug: 'bernardus-de-causmaecker-1721',
  },
  {
    name: 'Jacoba Lammens',
    sex: 'f',
    born: 1699,
    died: 1740,
    fatherName: 'Lieven Lammens',
    motherName: 'Livina de Vrieze',
    slug: 'jacoba-lammens-1699',
  },
  {
    name: 'Pieter de Decker',
    sex: 'm',
    born: 1705,
    died: 1780,
    fatherName: 'Joos de Decker',
    motherName: 'Petronella van de Steene',
    slug: 'pieter-de-decker-1705',
  },
  {
    name: 'Joanna de Pape',
    sex: 'f',
    born: 1654,
    died: 1723,
    fatherName: 'Vincent de Pape',
    motherName: 'Petronella Wauters',
    slug: 'joanna-de-pape-1654',
  },
  {
    name: 'Daniel Haverbeke',
    sex: 'm',
    born: 1652,
    died: 1723,
    fatherName: 'Lieven Haverbeke',
    motherName: 'Elisabeth Hercke',
    slug: 'daniel-haverbeke-1652',
  },
  {
    name: 'Lieven Haverbeke',
    sex: 'm',
    born: 1631,
    died: 1676,
    fatherName: 'Pieter Haverbeke',
    motherName: 'Anna van Hecke',
    slug: 'lieven-haverbeke-1631',
  },
  {
    name: 'Martina de Pape',
    sex: 'f',
    born: 1666,
    died: 1727,
    fatherName: 'Vincent de Pape',
    motherName: 'Petronella Wauters',
    slug: 'martina-de-pape-1666',
  },
  {
    name: 'Jan Francies Haverbeke',
    sex: 'm',
    born: 1725,
    died: 1779,
    fatherName: 'Pieter Bernard Haverbeke',
    motherName: 'Livina de Vrieze',
    slug: 'jan-francies-haverbeke-1725',
  },
  {
    name: 'Maria Haverbeke',
    sex: 'm',
    born: 1905,
    died: 1997,
    fatherName: 'Emile Haverbeke',
    motherName: 'Emma de Milliano',
    slug: 'maria-haverbeke-1905',
  },
  {
    name: 'Petronella de Decker',
    sex: 'f',
    born: 1731,
    died: 1781,
    fatherName: 'Pieter de Decker',
    motherName: 'Livina Haverbeke',
    slug: 'petronella-de-decker-1731',
  },
  {
    name: 'Livina Sierens',
    sex: 'f',
    born: 1761,
    died: 1826,
    fatherName: 'Jan Sierens',
    motherName: 'Maria van Waes',
    slug: 'livina-sierens-1761',
  },
  {
    name: 'Laurentia Haverbeke',
    sex: 'f',
    born: 1710,
    died: 1786,
    fatherName: 'Jan Haverbeke',
    motherName: 'Maria de Rycke',
    slug: 'laurentia-haverbeke-1710',
  },
  {
    name: 'Carel Haverbeke',
    sex: 'm',
    born: 1796,
    died: 1837,
    fatherName: 'Pieter Antone Haverbeke',
    motherName: 'Livina Sierens',
    slug: 'carel-haverbeke-1796',
  },
  {
    name: 'Elisabeth Hercke',
    sex: 'f',
    born: 1632,
    died: 1674,
    fatherName: 'Willem Hercke',
    motherName: 'Margriet de Brabander',
    slug: 'elisabeth-hercke-1632',
  },
  {
    name: 'Jan Haverbeke',
    sex: 'm',
    born: 1671,
    died: 1731,
    fatherName: 'Lieven Haverbeke',
    motherName: 'Elisabeth Hercke',
    slug: 'jan-haverbeke-1671',
  },
  {
    name: 'Anna van Hecke',
    sex: 'f',
    born: 1607,
    died: 1670,
    fatherName: 'Paschasius van Hecke',
    motherName: 'Martijntken Beelaert',
    slug: 'anna-van-hecke-1607',
  },
  {
    name: 'Maria Sturm',
    sex: 'f',
    born: 1835,
    died: 1917,
    fatherName: 'Charles Sturm',
    motherName: 'Seraphina Spelier',
    slug: 'maria-sturm-1835',
  },
  {
    name: 'Jacobus Bernardus van Brussel',
    sex: 'm',
    born: 1736,
    died: 1809,
    fatherName: 'Jan van Brussel',
    motherName: 'Elisabeth Haverbeke',
    slug: 'jacobus-bernardus-van-brussel-1736',
  },
];
</file>

<file path="src/App.scss">
iframe {
  display: none;
}
</file>

<file path="src/vite-env.d.ts">
/// <reference types="vite/client" />
</file>

<file path="src/types/Person.ts">
export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}
</file>

<file path="src/index.tsx">
import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
</file>

<file path="src/App.tsx">
import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
</file>

<file path="README.md">
# React Autocomplete

You have an array of people. Implement the Autocomplete component
using [Bulma Dropdown](https://bulma.io/documentation/components/dropdown/)
that will suggest people matching an entered text.

- suggestions should appear after some `delay` in typing (`debounce`);
- the `delay` should be customizable via props (default value is 300ms);
- show the list of all people when input is focused but empty ([Check this](https://mui.com/material-ui/react-autocomplete/#combo-box) to see how it can work)
- show `No matching suggestions` message if there are no people containing the entered text;
- don't run filtering again if the text has not changed (a pause in typing happened when the text was the same as before)
- save selected suggestion text to the input on click and close the list;
- pass the selected person to the `onSelected` callback passed via props;
- add an `h1` to the `App` showing `Name (born - died)` of the selected person or `No selected person`.
- when the selected person is displayed in the title, but the value in the input changes, the selected person should be cleared and `No selected person` should be shown.

## Instructions
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_autocomplete/) and add it to the PR description.
- Don't remove the `data-qa` attributes. It is required for tests.

## Troubleshooting

If you have got an error during `npm install` like this (when it tries to install `node-sass`):

```bash
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-sass@6.0.1 postinstall: `node scripts/build.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-sass@6.0.1 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

Solutions:

- Install `sass` library instead of `node-sass`:

```bash
  npm uninstall node-sass
  npm install sass --save-dev
```

An alternative solution is to install `node-sass@npm:sass` version:

```bash
  npm install node-sass@npm:sass --save-dev
```
</file>

</files>

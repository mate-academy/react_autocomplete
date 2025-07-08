import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from '../src/Autocomplete';

const DEFAULT_TITLE = 'No selected person';

export const App: React.FC = () => {
  const [title, setTitle] = useState(DEFAULT_TITLE);

  function handleSelected(person: Person) {
    setTitle(`${person.name} (${person.born} - ${person.died})`);
  }

  function handleChange(str: string) {
    if(str !== title) {
      setTitle(DEFAULT_TITLE);
    }
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>
        <Autocomplete
          onChange={handleChange}
          people={peopleFromServer}
          debounceDelay={300}
          onSelected={handleSelected}
        />
      </main>
    </div>
  );
};

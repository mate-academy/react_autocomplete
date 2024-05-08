import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [focusedInput, setFocusedInput] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    applyQuery(newQuery);
    setSelectedPerson(null);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const filteredPeople = peopleFromServer.filter(({ name }) => {
    return name.toLowerCase().includes(appliedQuery.trim().toLowerCase());
  });
  const { name, born, died } = selectedPerson ?? {};

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={filteredPeople}
          query={query}
          appliedQuery={appliedQuery}
          onQueryChange={handleQueryChange}
          onPersonClick={handlePersonClick}
          focusedInput={focusedInput}
          onInputFocus={setFocusedInput}
        />

        {filteredPeople.length === 0 && (
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
        )}
      </main>
    </div>
  );
};

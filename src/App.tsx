import React, { useMemo, useRef, useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const timerId = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const delay = 300;
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  function saveQuery(newQuery: string) {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setQuery(newQuery.toLowerCase().trim());
    }, delay);
  }

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query),
    );
  }, [query]);

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
          inputRef={inputRef}
          saveQuery={saveQuery}
          setSelectedPerson={setSelectedPerson}
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

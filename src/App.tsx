import React, { useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const field = useRef(null);

  function handlingError(boolean: boolean) {
    setError(boolean);
  }

  function selectAPerson(person: Person) {
    setSelectedPerson(person);
    setQuery(person.name);
  }

  function handleQuery(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={e => {
                handleQuery(e);
                setSelectedPerson(null);
              }}
              ref={field}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          {focus && (
            <Autocomplete
              query={query}
              people={peopleFromServer}
              onSelected={selectAPerson}
              onError={handlingError}
            />
          )}
        </div>
        {error && (
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

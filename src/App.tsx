import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';

import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debounceDelay = 300;

  const normalize = (text: string) => text.toLowerCase().trim();

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    setQuery(rawValue);

    if (normalize(rawValue) !== normalize(appliedQuery)) {
      setSelectedPerson(null);
    }

    applyQuery(rawValue);
  };

  let filteredList = [];
  const normalizedQuery = normalize(appliedQuery);

  if (query === '') {
    filteredList = peopleFromServer;
  } else {
    filteredList = peopleFromServer.filter(person =>
      normalize(person.name).includes(normalizedQuery),
    );
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={handleQueryChange}
            onBlur={() => {
              setTimeout(() => setIsDropdownOpen(false), 150);
            }}
          />
        </div>
        {isDropdownOpen && filteredList.length !== 0 && (
          <Autocomplete
            people={filteredList}
            onSelected={person => {
              setSelectedPerson(person);
              setQuery(person.name);
              setIsDropdownOpen(false);
            }}
          />
        )}

        {appliedQuery && filteredList.length === 0 && (
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

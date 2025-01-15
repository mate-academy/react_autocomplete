import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

type AppProps = {
  debounceDelay?: number;
};

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);

  const applyQuery = debounce(setAppliedQuery, debounceDelay);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmedQuery = value.trim();

    setQuery(value);
    setSelectedPerson(null);
    setIsListOpen(true);

    if (trimmedQuery) {
      applyQuery(trimmedQuery);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsListOpen(false);
  };

  const people = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isListOpen })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChangeQuery}
              onFocus={() => {
                setIsListOpen(true);
              }}
            />
          </div>

          {isListOpen && !!people.length && (
            <Dropdown people={people} onSelect={handleSelectPerson} />
          )}
        </div>

        {!people.length && (
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

import React, { useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  dobounceDelay?: number;
};

export const App: React.FC<Props> = ({ dobounceDelay = 100 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isActive, setActive] = useState(false);

  const applyQuery = debounce(setAppliedQuery, dobounceDelay);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setSelectedPerson(null);

    applyQuery(value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const filteredPeople = peopleFromServer.filter(person => {
    const trimmedQuery = appliedQuery.trim();

    return person.name.toLowerCase().includes(trimmedQuery.toLowerCase());
  });

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isActive })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setActive(true)}
              onBlur={() =>
                setTimeout(() => {
                  setActive(false);
                }, 25)
              }
            />
          </div>

          {filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <p
                      className={cn('is-clickable', {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      onClick={() => handlePersonSelect(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import cn from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

const getFilteredPeople = (people: Person[], query: string) => {
  let filteredPeople = [...people];
  const normalizedQuery = query.trim().toLowerCase();

  if (query) {
    filteredPeople = filteredPeople.filter(person =>
      person.name.trim().toLowerCase().includes(normalizedQuery),
    );
  }

  return filteredPeople;
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const people = getFilteredPeople(peopleFromServer, appliedQuery);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
    setIsInputFocused(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const isAnyOptions = people.length > 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson && query === appliedQuery
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsInputFocused(true)}
            />
          </div>

          {isInputFocused && isAnyOptions && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {people.map(person => {
                  return (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSelectedPerson(person)}
                    >
                      <p
                        className={cn(
                          person.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger',
                        )}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!isAnyOptions && (
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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type Props = {
  debounceDelay?: number;
};

export const App: React.FC<Props> = ({ debounceDelay = 300 }) => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), [
    debounceDelay,
  ]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setSelectedPerson(null);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsActive(false);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim() === '') {
      return people;
    }

    return people.filter(person => {
      return person.name
        .toLowerCase()
        .trim()
        .includes(appliedQuery.toLowerCase().trim());
    });
  }, [people, appliedQuery]);

  useEffect(() => {
    if (query.trim() === '') {
      setAppliedQuery('');
    }
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? 'No selected person'
            : `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
        </h1>

        <div className={`dropdown${isActive ? ' is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInput}
              onFocus={handleFocus}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {query && filteredPeople.length === 0 && (
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

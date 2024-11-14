import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

type Props = {
  debounceDelay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = ({ debounceDelay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceDelay]);

  const filteredPeople = useMemo(() => {
    if (debouncedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery]);

  useEffect(() => {
    setError(filteredPeople.length === 0);
  }, [filteredPeople]);

  const searchByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    setQuery(prevQuery => {
      if (prevQuery !== searchValue) {
        setSelectedPerson(null);

        if (onSelected) {
          onSelected(null);
        }
      }

      return searchValue;
    });
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownActive(false);
    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': isDropdownActive })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={searchByName}
              value={query}
              onFocus={() => {
                setIsDropdownActive(true);
                if (query.trim() === '') {
                  setError(false);
                }
              }}
              onBlur={() => {
                setIsDropdownActive(false);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handlePersonClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
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

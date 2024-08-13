import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'debounce';

interface Props {
  debounceDelay?: number;
}

export const App: React.FC<Props> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [listVisible, setListVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    born: number;
    died: number;
  } | null>(null);

  const filteredPeople = useMemo(() => {
    if (debouncedQuery.trim() === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery]);

  const onFocus = () => {
    if (query.trim() === '') {
      setDebouncedQuery('');
      setListVisible(true);
    }
  };

  const debouncedSetQuery = useMemo(
    () => debounce(setDebouncedQuery, debounceDelay),
    [debounceDelay],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setQuery(value);
      debouncedSetQuery(value);

      if (
        value === '' ||
        !filteredPeople.find(person => person.name === value)
      ) {
        setSelectedPerson(null);
      }

      setListVisible(true);
    },
    [debouncedSetQuery, filteredPeople],
  );

  const handlePersonSelect = (person: {
    name: string;
    born: number;
    died: number;
  }) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setListVisible(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setListVisible(false);
    }, 100);
  };

  const displayedPerson =
    selectedPerson || (filteredPeople.length > 0 ? filteredPeople[0] : null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${displayedPerson?.name} (${displayedPerson?.born} - ${displayedPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={handleBlur}
            />
          </div>
          {listVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => {
                      handlePersonSelect(person);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
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

import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debounceQuery, setDebonceQuery] = useState('');
  const filteringPeople = useMemo(() => {
    if (!debounceQuery.trim()) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => {
      const name = person.name.toLowerCase();

      return name.includes(debounceQuery.toLowerCase());
    });
  }, [debounceQuery]);

  const onFocus = () => {
    setVisible(true);
  };

  const onBlur = () => {
    setTimeout(() => setVisible(false), 100);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setVisible(false);
  };

  const debouncedQuery = useMemo(
    () =>
      debounce((value: string) => {
        setDebonceQuery(value);
      }, 300),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    debouncedQuery(value);

    if (!filteringPeople.find(person => person.name === value)) {
      setSelectedPerson(null);
    }

    setVisible(true);
  };

  const hasPeople = filteringPeople.length > 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
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
              onChange={handleQueryChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {visible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              {hasPeople && (
                <div className="dropdown-content">
                  {filteringPeople.map(people => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={people.name}
                      onClick={() => {
                        handleSelectPerson(people);
                      }}
                    >
                      <p className="has-text-link">{people.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!hasPeople && (
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

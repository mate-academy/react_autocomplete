import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

type Person = (typeof peopleFromServer)[number];

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (query === debouncedQuery) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, debouncedQuery]);

  const visiblePeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => {
                    setQuery(person.name);
                    setSelectedPerson(person);
                    setIsFocused(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isFocused && visiblePeople.length === 0 && (
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

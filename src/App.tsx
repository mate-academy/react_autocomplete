import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [delay] = useState(300);
  const [onSelected, setOnSelected] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value.trim() !== query) {
      applyQuery(event.target.value);
    }

    setOnSelected(null);
  };

  const handleClick = (persone: Person) => {
    applyQuery.cancel();

    setOnSelected(persone);
    setQuery(persone.name);
    setAppliedQuery('');

    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {onSelected ? (
          <h1 className="title" data-cy="title">
            {`${onSelected.name} (${onSelected.born} - ${onSelected.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            {`No selected person`}
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              onChange={event => handleChange(event)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              className="input"
              data-cy="search-input"
            />
          </div>

          {(isFocused || appliedQuery) && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.slug}
                    onClick={() => handleClick(people)}
                  >
                    <p className="has-text-link">{people.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPeople.length === 0 && appliedQuery && (
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

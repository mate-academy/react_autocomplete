import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import cn from 'classnames';

export const App: React.FC = () => {
  const delay = 300;

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  const selectedPerson = useMemo(() => {
    return peopleFromServer.find(person => person.name === query);
  }, [query]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    },
    [],
  );

  const isFocused = useCallback(() => {
    setShowDropdown(true);
  }, []);

  const isBlured = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 100);
  }, []);

  const handleChoose = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      person: Person,
    ) => {
      event.preventDefault();

      setAppliedQuery(person.name);
      setQuery(person.name);
    },
    [],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': showDropdown,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={isFocused}
              onBlur={isBlured}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map((person: Person) => (
                  <a
                    data-cy="suggestion-item"
                    key={person.slug}
                    className="dropdown-item"
                    onClick={event => handleChoose(event, person)}
                  >
                    {person.name}
                  </a>
                ))
              ) : (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import 'bulma/css/bulma.min.css';
import { Person } from './types/Person';
import cn from 'classnames';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(
    () =>
      debounce(value => {
        setAppliedQuery(value);
      }, 300),
    [setAppliedQuery],
  );

  const filteredQuery = useMemo(() => {
    if (appliedQuery) {
      const lawerCasedQuery = appliedQuery.toLowerCase();

      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(lawerCasedQuery),
      );
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    applyQuery(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.died} - ${selectedPerson.born})`
            : 'No selected person'}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': isFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChangeInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredQuery.length > 0 ? (
                filteredQuery.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onMouseDown={() => handleSelect(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
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

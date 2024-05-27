import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState('No selected person');
  const [titleSelectPerson, setTitleSelectPerson] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);

    const hasMatch = peopleFromServer.some(person =>
      person.name
        .toLowerCase()
        .includes(event.target.value.trim().toLowerCase()),
    );

    setHasError(hasMatch);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const personData = (person: Person) => {
    setSelectedPerson(`${person.name} (${person.born} - ${person.died})`);

    setQuery(person.name);
    setTitleSelectPerson(person.name);
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (query !== titleSelectPerson) {
      setDropdownVisible(true);
      setSelectedPerson('No selected person');
    }
  }, [query, titleSelectPerson, selectedPerson]);

  const handleChangeFocus = () => {
    if (!query) {
      setDropdownVisible(true);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': dropdownVisible,
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
              onFocus={handleChangeFocus}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((people, index) => (
                <div
                  className="dropdown-item"
                  key={index}
                  data-cy="suggestion-item"
                  onClick={() => personData(people)}
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hasError && (
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

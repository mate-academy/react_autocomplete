import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [debouncedFilterValue, setDebouncedFilterValue] = useState(filterValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSetFilterValue = useCallback(
    debounce((value: string) => {
      setDebouncedFilterValue(value);
    }, 300),
    [],
  );

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
    setFilterValue(person ? person.name : '');
    setIsDropdownOpen(false);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);

    debouncedSetFilterValue(event.target.value);

    if (selectedPerson && event.target.value) {
      setSelectedPerson(null);
    }

    setIsDropdownOpen(true);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(debouncedFilterValue.toLowerCase()),
    );
  }, [debouncedFilterValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div
          className={classNames('dropdown', { 'is-active': isDropdownOpen })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={filterValue}
              onChange={handleChangeText}
              onFocus={handleFocus}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {isDropdownOpen &&
              filteredPeople.map(person => {
                return (
                  <div className="dropdown-content" key={person.slug}>
                    <div
                      className="dropdown-item"
                      onClick={() => handleSelectedPerson(person)}
                      data-cy="suggestion-item"
                    >
                      <p
                        className={classNames({
                          'has-text-link': person.sex === 'm',
                          'has-text-danger': person.sex === 'f',
                        })}
                      >
                        {person.name}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {!filteredPeople.length && (
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

import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import cn from 'classnames';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const handleFilter = (dropdownQuery: string, personArray: Person[]) => {
  return [...personArray].filter(person => {
    const name = person.name.toLocaleLowerCase();
    const queryForSearch = dropdownQuery.trim().toLocaleLowerCase();

    return name.includes(queryForSearch);
  });
};

export const App: React.FC = () => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [dropdownQuery, setDropdownQuery] = useState('');
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const visiblePeople = handleFilter(appliedQuery, peopleFromServer);

  const handleDropdownInactive = () => {
    return setTimeout(() => {
      setIsDropdownActive(false);
    }, 300);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDropdownQuery(event.target.value);
    applyQuery(event.target.value.trim());
    setChosenPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson
            ? `${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isDropdownActive })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={dropdownQuery}
              onFocus={() => setIsDropdownActive(true)}
              onBlur={handleDropdownInactive}
              onChange={event => handleInputChange(event)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {visiblePeople.length > 0 ? (
              <div className="dropdown-content">
                {visiblePeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => {
                      setChosenPerson(person);
                      setDropdownQuery(person.name);
                      setIsDropdownActive(false);
                    }}
                  >
                    <p
                      className={
                        person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
